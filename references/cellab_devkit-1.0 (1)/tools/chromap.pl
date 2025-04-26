
    #   Create a "test pattern" image showing the 256 colour
    #   in the palette.

    use strict;
    use warnings;

    my ($cols, $rows) = (320, 200);
    
    my $sdim =($cols < $rows) ? $cols : $rows;
    my $sep = 1;
    my $square = int(($sdim - ($sep * 15)) / 16);
    
    #   Create pixel array and initialise to zero
    
    my @pixel;
    my $lmarg = int(($cols - ((($square + $sep) * (16 - 1)) + 3)) / 2);
    my $tmarg = int((($rows - ((($square + $sep) * (16 - 1)) + 3)) / 2) - 5);
    for (my $y = 0; $y < $rows; $y++) {
         for (my $x = 0; $x < $cols; $x++) {
            push(@pixel, 0);
        }
    }
    
    for (my $vy = 0; $vy < 16; $vy++) {
        my $py = $tmarg + ($vy * ($square + $sep)) + (($vy >= 8) ? 3 : 0);
        for (my $vx = 0; $vx < 16; $vx++) {
            my $px = $lmarg + ($vx * ($square + $sep)) + (($vx >= 8) ? 3 : 0);
            my $state = ($vy * 16) + $vx;
            square($px, $py, $square, $state);
        }
    }
    
    #   Write an uncompressed ASCII image file of the pixels

    open(FP, ">chromap.jcp") || die("Cannot create chromap.jcp");
    for (my $y = 0; $y < $rows; $y++) {
        print(FP "0 ");
        for (my $x = 0; $x < $cols; $x++) {
            printf(FP "%X ", $pixel[($y * $cols) + $x]);
        }
        print(FP "0\n");
    }
    close(FP);
    
    
    #   Set a pixel in the array
    
    sub set {
        my ($x, $y, $state) = @_;
        
        $pixel[($y * $cols) + $x] = $state;
    }
    
    #   Draw a square in the array
    
    sub square {
        my ($x, $y, $size, $state) = @_;
        
        for (my $ix = 0; $ix < $size; $ix++) {
            for (my $iy = 0; $iy < $size; $iy++) {
                set($x + $ix, $y + $iy, $state);
            }
        }
    }
