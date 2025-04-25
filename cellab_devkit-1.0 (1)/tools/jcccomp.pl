#! /usr/bin/perl

    #   Convert an ASCII colour palette file (VGA
    #   or full RGB colours) to binary.

    use strict;
    use warnings;

    #   Set $VGAcol = 1 to scale output palette to VGA (0-63) colours
    my $VGAcol = 0;

    #   Set $BINpal = 1 to generate a binary palette file
    my $BINpal = 1;

    if (scalar(@ARGV) != 2) {
        print("Usage: jcccomp.pl <palette> <bin_palette>\n");
        exit(0);
    }
    
    my $palette = $ARGV[0];
    my $cpalette = $ARGV[1];
    
    #   Load colour palette file
    
    my @cpali;          # Index to colour array
    my $l;
    my $maxval = 255;
    
    open(FI, "<$palette") || die("Cannot open colour palette $palette");
    $l = <FI> || die("Cannot read palette format code from $palette");
    $l =~ m/^(\d)/;
    $l = $1;
    my $palmax = 63;	# Palette max RGB intensity
    if (($l != 2) && ($l != 3) && ($l != 5)) {
        die("Cannot read palette format $l from $palette");
    }
    if ($l == 5) {
    	$palmax = 255;
    }
    
    my $i = 0;
    while ($l = <FI>) {
        $l =~ m/^\s*(\d+)\s+(\d+)\s+(\d+)/ ||
            die("Cannot parse line in $palette: $l");
        my ($r, $g, $b) = ($1, $2, $3);
        #   Rescale palette entry to maxval of image
        $r = int(($r * $maxval) / $palmax);
        $g = int(($g * $maxval) / $palmax);
        $b = int(($b * $maxval) / $palmax);
        my $rgb = "$r $g $b";
        $cpali[$i++] = $rgb;
    }
        
    close(FI);
    
    if ($i > 256) {
        die("Colour palette $palette contains $i entries.  Maximum is 256");
    }

    #   Write a colour palette file with the unique colours

    open(FC, ">$cpalette") || die("Cannot create $cpalette");
    if ($BINpal) {
        if ($VGAcol) {
            print(FC "4\r\n");
        } else {
            print(FC "6\r\n");
        }
        my $idx = 0;
        for (my $i = 0; $i < scalar(@cpali); $i++) {
            my $cpv = $cpali[$i];
            $cpv =~ m/(\d+)\s+(\d+)\s+(\d+)/ || die("Cannot re-parse $cpv");
            my ($ir, $ig, $ib) = ($1, $2, $3);
            $ir = cscale($ir);
            $ig = cscale($ig);
            $ib = cscale($ib);
            print(FC chr($ir) . chr($ig) . chr($ib));
            $idx++;
        }
        #   Binary palette must contain 256 entries.  Fill any
        #   unused entries with black.
        for (my $ex = $idx; $ex < 256; $ex++) {
            print(FC "\0\0\0");
        }
    } else {
        if ($VGAcol) {
            print(FC "2 ; R G B\n");
        } else {
            print(FC "5 ; R G B\n");
        }
        my $idx = 0;
        for (my $i = 0; $i < scalar(@cpali); $i++) {
            my $cpv = $cpali[$i];
            $cpv =~ m/(\d+)\s+(\d+)\s+(\d+)/ || die("Cannot re-parse $cpv");
            my ($ir, $ig, $ib) = ($1, $2, $3);
            $ir = cscale($ir);
            $ig = cscale($ig);
            $ib = cscale($ib);
            print(FC "$ir $ig $ib ; $idx\n");
            $idx++;
        }
    }
    close(FC);

    #   Rescale colour indices to VGA intensities

    sub cscale {
        my ($v) = @_;

        if ($VGAcol) {
            return int(($v * 63) / 255);
        }
        return $v;
    }
