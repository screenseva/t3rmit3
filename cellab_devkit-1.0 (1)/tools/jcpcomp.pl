#! /usr/bin/perl

    #   Compress a CelLab ASCII pattern file
    
    #   An uncompressed ASCII pattern file is converted to
    #   either a compressed ASCII file or a binary pattern
    #   file.  If you don't have an uncompressed ASCII file
    #   to start with, just load it into WebCA and dump it
    #   as uncompressed ASCII.

    use strict;
    use warnings;

    if (scalar(@ARGV) < 2) {
        print("Usage: perl jcpcomp.pl [-ascii] infile.jcp outfile.jcp\n");
        exit(0);
    }
    
    my $ascii = 0;
    my $checkLength = 1;        # Verify map is of standard length ?
    
    if ($ARGV[0] =~ m/^\-a/) {
        $ascii = 1;
        shift(@ARGV);
    }
    
    my @img = loadjcp($ARGV[0]);
    
    open(FO, ">$ARGV[1]") || die("Cannot create $ARGV[1]");
    if ($ascii) {
        print(FO "*");      # Print compressed file marker
        my $last = -1;
        my $run = -1;
        my $groups = 0;
        for (my $i = 0; $i < scalar(@img); $i++) {
            my $p = $img[$i];
            if ($p == $last) {
                $run++;
            } else {
                if ($run > 0) {
                    printf(FO "$run,%x", $last);
                    if ($groups > 14) {
                        $groups = 0;
                        print(FO "\n");
                    } else {
                        print(FO " ");
                        $groups++;
                    }
                }
                $run = 1;
                $last = $p;
            }
        }
        if ($run > 0) {
            printf(FO "$run,%x", $last);
        }
        print(FO "\n");
    } else {
        print(FO ":\0\1\2");       # File sentinel with dummy length
        my $last = -1;
        my $run = -1;
        my $groups = 0;
        for (my $i = 0; $i < scalar(@img); $i++) {
            my $p = $img[$i];
            if ($p == $last) {
                $run++;
            } else {
                if ($run > 0) {
                    my $rs = rstate($last);
                    if ($run == 1) {
                        print(FO chr(3) . chr($rs));  # RLONEB
                    } elsif ($run <= 256) {
                        print(FO chr(2) . chr($run - 1) . chr($rs)); # RLRUN
                    } else {
                        print(FO chr(7) . chr(int(($run - 1) / 256)) .
                            chr(($run - 1) % 256) . chr($rs));  # RLLRUN
                    }
                }
                $run = 1;
                $last = $p;
                
                #   We have seen a state which marks the end of a
                #   run.  Look ahead and see if there are additional
                #   states which do not comprise a run which begins
                #   with this one.  If so, output them as an
                #   uncompressed sequence.

                if ($i < (scalar(@img) - 1)) {
                    my $j;
                    for ($j = $i + 1; $j < scalar(@img); $j++) {
                        if ($img[$j - 1] == $img[$j]) {
                            last;
                        }
                    } 
                    
                    #   At this point, $i is the potential start of a
                    #   non-run and $j - 1 is the start of the next
                    #   run.  We now want to output all of the non-run
                    #   between $i and $j - 2 inclusive as a non-run,
                    #   then reset with the character at $j - 1 as the
                    #   start of the next run.
                
                    my $nrl = ($j - 2) - $i;        # Length of non-run
                    if ($nrl > 0) {
                        my $nrn = $nrl - 1;
                        if ($nrn <= 256) {
                            print(FO chr(4) . chr($nrn)); # RLUNCS
                        } else {
                            print(FO chr(8) . chr(int(($nrn) / 256)) .
                                chr(($nrn) % 256));  # RLLUNCS
                           
                        }
                        for (my $k = $i; $k < $i + $nrl; $k++) {
                            print(FO chr(rstate($img[$k])));
                        }
                        $i = $j - 2;
                        $last = $img[$j - 2];
                        $run = 1;
                    }
                }
            }
        }
        if ($run > 0) {
            my $rs = rstate($last);
            if ($run == 1) {
                print(FO chr(3) . chr($rs));  # RLONEB
            } elsif ($run <= 256) {
                print(FO chr(2) . chr($run - 1) . chr($rs)); # RLRUN
            } else {
                print(FO chr(7) . chr(int(($run - 1) / 256)) .
                    chr(($run - 1) % 256) . chr($rs));  # RLLRUN
            }
        }
        printf(FO chr(6));        # RLEND
        
    }
    close(FO);
    
    #   Rotate state into form used in binary pattern
    
    sub rstate {
        my ($s) = @_;
        
        return ($s >> 1) | (($s & 1) << 7);
    }

    #   Load uncompressed pattern file into an array

    sub loadjcp {
        my ($file) = @_;

        open(FI, "<$file") || die("Unable to open $file");

        my @jcp;
        my $maplen = 322 * 200;
        my $n = 0;
        my $l;

        while ($l = <FI>) {
            if ($l !~ m/\s*#/) {
                while ($l =~ s/([0-9a-fA-F]+)//) {
                    my $d = hex($1);
                    push(@jcp, $d);
                    $n++;
                }
            }
        }

        close(FI);

        if ($checkLength && ($n != $maplen)) {
            die("Map bits $n disagrees with declared size $maplen");
        }

        return @jcp;
    }
