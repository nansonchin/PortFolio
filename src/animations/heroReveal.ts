import gsap from "gsap";

export function heroReveal() {
 const timeline= gsap.timeline({
    defaults:{
        ease:'power4.out'
    }
 })

 timeline.from(".hero-eyebrow",{
    y:20,
    opacity:0,
    duration:0.7
 })

  timeline.from(".hero-letter", {
    yPercent:120,
    opacity:0,
    duration:1,
    stagger:{
        each:0.025
    }
  },"-=0.3");

  timeline.from(
    ".hero-description",
    {
      y: 40,
      opacity: 0,
      duration: 1,
    },
    "-=0.5",
  );

  timeline.from(".hero-scroll-indicator",{
        y:20,
        opacity:0,
        duration:0.7
  },"-=0.5")

  gsap.fromTo("scroll-line",
    {
        scaleX:0.2,
        opacity:0.4,
    } ,{
        scaleX:1,
        opacity:1,
        duration:1.8,
        repeat:-1,
        yoyo:true,
        ease:"sine.inOut"
    } 
  )

  gsap.to(".gold-light", {
    x: 100,
    y: -50,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  return timeline;
}
