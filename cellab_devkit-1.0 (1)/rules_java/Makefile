
#OPTIMISE = -O
OPTIMISE = -g

RULES = aurora.class axons.class \
        banks.class balloons.class bbm.class \
        bob.class bootperc.class \
	border.class brailife.class brain.class \
        byl.class choureg.class critters.class \
	dendrite.class dentim.class earthgas.class ecolibra.class \
        endworld.class \
	ex_life.class faders.class flick.class \
        forest.class fractal.class \
	fredmem.class gasflow.class \
        glooper.class griff.class gyre.class \
	heat.class heatwave.class hglass.class hodge.class hppgas.class \
	langton.class lant.class life.class logic.class mite.class \
        nluky.class owncode.class \
	parks.class \
        perfumem.class perfumer.class perfumet.class perfumex.class \
        pond.class \
	rainzha.class ranch.class revecoli.class \
	rug.class rugf.class ruglap.class \
	shortpi.class soot.class soundca.class \
        spins.class sublime.class \
	timetun.class totalistic.class \
	turmite.class turmite4.class \
	venus.class vonpar.class vote.class \
	votedna.class wator.class wind.class xtc.class \
	zhabo.class zhabof.class zhaboff.class

all:	ruletable.class $(RULES) $(RULES:.class=.jc)

test:	all
	java life
	cp life.jc /tmp

transfer:
	cp *.jc /tmp

clean:
	rm -f *.class *.jc

.java.class:
	javac $(OPTIMISE) $*.java

.class.jc: ruletable.class
	java $*

.SUFFIXES:  .java .class .jc
