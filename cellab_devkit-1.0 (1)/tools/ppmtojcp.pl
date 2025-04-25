#! /usr/bin/perl

    #   Convert full-colour (256 colours or fewer) to a
    #   .jcp pattern and .jcc colour palette.

    use strict;
    use warnings;

    #   Set $VGAcol = 1 to scale palette to VGA (0-63) colours
    my $VGAcol = 0;

    #   Set $BINpal = 1 to generate a binary palette file
    my $BINpal = 1;

    if (!$ARGV[0]) {
        print("Usage: ppmtojcp.pl <PPMbase_name>\n");
        exit(0);
    }

    my $basename = $ARGV[0];

    open(FI, "<$basename.ppm") || die("Cannot open $basename.ppm");

    my $l;

    $l = <FI>;
    if ($l !~ m/^P3/) {
        die("$basename.ppm is not a PPM file");
    }

    my ($cols, $rows, $maxval) = (-1, -1, -1);
    while ($l = <FI>) {
        if ($l !~ m/\s*#/) {
            if ($cols < 0) {
                $l =~ m/\s*(\d+)\s+(\d+)/ || die("Cannot parse dimensions: $l");
                $cols = $1;
                $rows = $2;
            } else {
                $l =~ m/\s*(\d+)/ || die("Cannot parse maxval: $l");
                $maxval = $1;
                last;
            }
        }
    }
    print(STDERR "Image: $cols x $rows, maxval $maxval\n");

    #   Now read in the pixels.  NETPBM allows any number of
    #   RGB values on a line, but GIMP writes files with just
    #   one number per line.  This code is intended to handle
    #   the more general format, but I haven't yet tested it
    #   on such a file.

    my @pixels;                 # Array of RGB pixels
    my $nrgb = 0;               # Index of unique RGB values
    my %rgb;                    # Hash of unique RGB values
    my @pixel;                  # Array for assembling pixels

    while ($l = <FI>) {
        if ($l !~ m/\s*#/) {
            while ($l =~ s/\s*(\d+)\s*//) {
                my $v = $1;
                if ($v > 255) {
                    die("Invalid pixel value $v");
                }
                push(@pixel, $v);
                if (scalar(@pixel) == 3) {
                    my $pix = "$pixel[0] $pixel[1] $pixel[2]";
                    push(@pixels, $pix);    # Add pixel to image
                    if (!$rgb{$pix}) {      # Add colour to map if new
                        $rgb{$pix} = $nrgb++;
                    }
                    @pixel = ();
                }
            }
        }
    }
    close(FI);

    #   At this point the image is in memory and the colour
    #   table is built.

    print(STDERR "Pixels read: ", scalar(@pixels), ".  Unique colours: ",
        scalar(keys(%rgb)), "\n");
        
    if (scalar(keys(%rgb)) > 256) {
        die("Image contains " . scalar(keys(%rgb)) .
            " unique colours.  Must be 256 or fewer");
    }

    if (scalar(@pixels) != ($rows * $cols)) {
        die("Image length (", scalar(@pixels),
            ") disagrees with expected length of ",
            ($rows * $cols));
    }

    #   Dirty trick.  If the image has fewer than 256 colours and
    #   does not have a colour table entry for black (0 0 0), add
    #   one.  It will sort to the top when the palette is generated
    #   and give the image the nice property that the zero state
    #   is black.

    if (!$rgb{"0 0 0"} && ($nrgb < 256)) {
        $rgb{"0 0 0"} = $nrgb++;
#print(STDERR "Adding black to the colour table.\n");
    }

    #   Write a colour palette file with the unique colours

    open(FC, ">$basename.jcc") || die("Cannot create $basename.jcc");
    if ($BINpal) {
        if ($VGAcol) {
            print(FC "4\r\n");
        } else {
            print(FC "6\r\n");
        }
        my $idx = 0;
        foreach my $cpv (sort(keys(%rgb))) {
            $cpv =~ m/(\d+)\s+(\d+)\s+(\d+)/ || die("Cannot re-parse $cpv");
            my ($ir, $ig, $ib) = ($1, $2, $3);
            $ir = cscale($ir);
            $ig = cscale($ig);
            $ib = cscale($ib);
            print(FC chr($ir) . chr($ig) . chr($ib));
            $rgb{$cpv} = $idx++;
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
        foreach my $cpv (sort(keys(%rgb))) {
            $cpv =~ m/(\d+)\s+(\d+)\s+(\d+)/ || die("Cannot re-parse $cpv");
            my ($ir, $ig, $ib) = ($1, $2, $3);
            $ir = cscale($ir);
            $ig = cscale($ig);
            $ib = cscale($ib);
            print(FC "$ir $ig $ib ; $idx\n");
            $rgb{$cpv} = $idx++;
        }
    }
    close(FC);

    #   Write an uncompressed ASCII image file with indices to the pixels

    open(FP, ">$basename.jcp") || die("Cannot create $basename.jcp");
    for (my $y = 0; $y < $rows; $y++) {
        print(FP "0 ");
        for (my $x = 0; $x < $cols; $x++) {
            printf(FP "%X ", $rgb{$pixels[($y * $cols) + $x]});
        }
        print(FP "0\n");
    }
    close(FP);

    #   Rescale colour indices to VGA intensities

    sub cscale {
        my ($v) = @_;

        if ($VGAcol) {
            return int(($v * 63) / 255);
        }
        return $v;
    }
