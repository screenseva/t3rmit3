#! /usr/bin/perl

    #   Convert full-colour (256 colours or fewer) PPM to a
    #   .jcp pattern compliant with the colours in a
    #   specified .jcc colour palette.  If the image
    #   contains colours which are not present in the
    #   palette, a warning will be issued and those pixels
    #   will be mapped to palette index zero.
    
    #   Be sure when drawing patterns to be converted by
    #   this program that you turn off antialiasing in your
    #   paint program.  Otherwise, objects will contain
    #   mixed intensity pixels which won't be found in the
    #   colour palette you're using.
    
    use strict;
    use warnings;
    
    if ((!$ARGV[0]) || (!$ARGV[1])) {
        print("Usage: makejcp.pl <PPMbase_name> <palette>\n");
        exit(0);
    }

    my $basename = $ARGV[0];
    my $palette = $ARGV[1];
    
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
    
    #   Load colour palette file
    
    my %cpal;           # Colour to palette index hash
    my @cpali;          # Index to colour array
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
        $cpali[$i] = $rgb;
        #   If more than one palette index maps to the same
        #   colour, remember the first one we saw.  In this
        #   case it is likely that duplicated indices are to
        #   handle texture in the map, which will be added
        #   after the pattern is loaded.
        if (!defined($cpal{$rgb})) {
            $cpal{$rgb} = $i;
        }
        $i++;
    }
        
    close(FI);
    
    #   At this point the image is in memory and the colour
    #   palette has been loaded.
    
    print(STDERR "Pixels read: ", scalar(@pixels), ".  Unique colours: ",
        scalar(keys(%rgb)), "\n");

    if (scalar(@pixels) != ($rows * $cols)) {
        die("Image length (", scalar(@pixels),
            ") disagrees with expected length of ",
            ($rows * $cols));
    }
                
    #   Walk through the image, looking up pixels in the palette
    #   and outputting their indices as an uncompressed ASCII
    #   pattern file.  Any pixels whose colours are not present
    #   in the palette will produce a warning (for the first
    #   occurrence of the colour) and be set to the first index
    #   in the palette.
    
    my %missing;            # Colours in image not in palette
    open(FP, ">$basename.jcp") || die("Cannot create $basename.jcp");
    for (my $y = 0; $y < $rows; $y++) {
        print(FP "0 ");
        for (my $x = 0; $x < $cols; $x++) {
            my $px = $pixels[($y * $cols) + $x];
            if (!defined($cpal{$px})) {
                if (!$missing{$px}) {
                    print(STDERR "Colour ($px) used in image, not in palette.\n");
                    $missing{$px} = 1;
                }
                print(FP "0 ");
            } else {
                printf(FP "%X ", $cpal{$px});
            }
        }
        print(FP "0\n");
    }
    close(FP);
