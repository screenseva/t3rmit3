
                    Cellab Development Kit
                    
The contents of this archive are as follows:

    evaluators
        Standard user evaluators in JavaScript
        
    palettes
        Standard palettes (.jcc files)
        
    patterns
        Standard patterns (.jcp files)

    ruledefs
        Standard rule definitions in JavaScript (.js)
        
    rules
        Standard compiled rules (.jc files).  These were
        produced from the files in the rules_java directory.
        
    rules_java
        Java source code (.java files) for standard rules.
        Includes ruletable.java and ruletable.class to
        make .jc files from .java files.
        
    shows
        Collection of shows (.jss files), including the
        standard demo
        
    tools
        Utility programs written in Perl.
        
            chromap.pl
                Create the chroma.jcc palette test pattern
                included in the standard patterns directory.
                This program writes an uncompressed ASCII pattern
                file, which is compressed for release with jcpcomp.pl.
                This program may be a useful starting point for
                programmatic generation of other images.
        
            jcccomp.pl
                Read an ASCII color palette (.jcc) file (either
                VGA or RGB colors) and write a binary color
                RGB palette file.  You can write ASCII or VGA
                format palettes by changing internal variables,
                but you shouldn't.
        
            jcpcomp.pl
                Read an uncompressed ASCII pattern (.jcp) file
                and convert it to a compressed binary pattern.
                
            makejcp.pl
                Create a pattern (.jcp) file from an uncompressed
                ASCII PPM image and an ASCII color palette (.jcc)
                file.  Pixels in the image are mapped to states in
                the pattern which exactly match the colors in
                the palette.  Output is an uncompressed ASCII pattern
                file; use jcpcomp to compress if you wish.
                
            ppmtojcp.pl
                Convert an ASCII PPM image containing 256 or fewer
                unique colors into a pattern (.jcp) file (uncompressed
                ASCII format) and a companion palette (.jcc) file
                (ASCII format).  This can be used to create colour
                images to demonstrate image processing rules.  The
                standard fullearth.jcp and fullearth.jcc were created
                with this utility.

The contents of this archive are in the public domain and may be
used in any manner without any restrictions whatsoever.

For complete documentation and the current version of this
development kit, please see:
    http://www.fourmilab.ch/cellab/
