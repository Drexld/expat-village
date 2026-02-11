import svgPaths from "./svg-z12h5q9frx";
import imgBackground from "figma:asset/d0275e23c43af00cd9b083ce8cce64d94def46a3.png";
import imgAvatarImage from "figma:asset/8e565f7d045ef25eb7ea059c5099acaaa43f219a.png";
import imgDash from "figma:asset/51296093c710b21fcfee187c1f2238fe9a08b946.png";
import imgDash1 from "figma:asset/983ca4549ac080e8c43fd2f3fb775773db681114.png";
import imgBlur from "figma:asset/5b3936d908cd47cd52340370d8efea352e60501d.png";
import imgProgress from "figma:asset/c80bbd8a9fd9755ef424fa1678a5f900b3682e38.png";
import imgProgess3 from "figma:asset/1814cae1e275d959fbfd6abc8ba657579f5ca34c.png";

function BackgroundWeb() {
  return (
    <div className="absolute left-[-408px] opacity-30 overflow-clip size-[838px] top-[-83px]" data-name="Background Web 1">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute blur-[58.194px] h-[523.75px] left-1/2 top-1/2 w-[838px]" data-name="Background">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgBackground} />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(258.949deg, rgba(37, 40, 93, 0) 11.028%, rgba(12, 36, 137, 0.75) 53.424%)" }} />
        </div>
      </div>
    </div>
  );
}

function Time() {
  return (
    <div className="-translate-y-1/2 absolute h-[54px] left-0 right-[64.25%] top-1/2" data-name="Time">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] inset-[33.96%_37.67%_25.3%_38.26%] leading-[22px] text-[17px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Battery() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[33.33%] contents left-[calc(50%+24.8px)] top-[42.59%]" data-name="Battery">
      <div className="-translate-x-1/2 absolute border border-solid border-white bottom-[33.33%] left-[calc(50%+23.64px)] opacity-35 rounded-[4.3px] top-[42.59%] w-[25px]" data-name="Border" />
      <div className="-translate-x-1/2 absolute bottom-[41.01%] left-[calc(50%+37.8px)] top-[51.45%] w-[1.328px]" data-name="Cap">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.32804 4.07547">
          <path d={svgPaths.p193f1400} fill="var(--fill-0, white)" id="Cap" opacity="0.4" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-[37.04%] left-[calc(50%+23.64px)] rounded-[2.5px] top-[46.3%] w-[21px]" data-name="Capacity" />
    </div>
  );
}

function Levels() {
  return (
    <div className="-translate-y-1/2 absolute h-[54px] left-[64.25%] right-0 top-1/2" data-name="Levels">
      <Battery />
      <div className="-translate-x-1/2 absolute bottom-[33.4%] left-[calc(50%-4.59px)] top-[43.77%] w-[17.142px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
          <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[33.77%] left-[calc(50%-30.26px)] top-[43.58%] w-[19.2px]" data-name="Cellular Connection">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
          <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, white)" fillRule="evenodd" id="Cellular Connection" />
        </svg>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="Status Bar">
      <Time />
      <Levels />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[44px]">
      <div className="absolute inset-[0_0_29.07%_35.92%]" data-name="Subtract">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.195 31.2089">
          <path d={svgPaths.p39dfd480} fill="var(--fill-0, #3395FF)" id="Subtract" />
        </svg>
      </div>
      <div className="absolute inset-[15.34%_15.35%_0_0] rounded-[24.832px]" data-name="Avatar Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24.832px] size-full" src={imgAvatarImage} />
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 text-center tracking-[-0.4px]">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[25px] relative shrink-0 text-[20px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Hello, Sourasith
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.7)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        You have 20 devices currently on
      </p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-[268px]">
      <Frame2 />
      <Frame28 />
    </div>
  );
}

function Leading() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center p-[6px] relative rounded-[32px] shrink-0 size-[44px]" data-name="Leading">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.72px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        􀝖
      </p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-start justify-between px-[20px] relative shrink-0 w-[430px]">
      <Frame29 />
      <Leading />
    </div>
  );
}

function Divider() {
  return <div className="h-px shrink-0 w-[430px]" data-name="Divider" />;
}

function NavigationBarIPhoneCompactSizeClass() {
  return (
    <div className="backdrop-blur-[25px] content-stretch flex flex-col items-center relative shrink-0 w-[430px]" data-name="Navigation Bar - iPhone (Compact Size Class)">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.3)] border-b-[0.333px] border-solid inset-0 pointer-events-none" />
      <StatusBar />
      <Frame19 />
      <Divider />
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-px" data-name="Navigation Bar">
      <NavigationBarIPhoneCompactSizeClass />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Current Energy Usage
      </p>
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Title">
      <Frame6 />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Title">
      <Title1 />
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[13px] text-[rgba(255,255,255,0.6)] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41 AM
      </p>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[#59b4f7] text-[28px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        2.1 kW
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[17px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Your home's power draw at this moment.`}</p>
    </div>
  );
}

function ButtonCircle() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􀋦</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[0] relative shrink-0 text-center tracking-[-0.4px] w-[110px] whitespace-nowrap" data-name="Content">
      <div className="flex flex-col font-['SF_Pro:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[22px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px]">48 kWh</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[21px]">24-Hr Usage</p>
      </div>
    </div>
  );
}

function ChargedAtStation() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-[157px]" data-name="Charged at station">
      <ButtonCircle />
      <Content2 />
    </div>
  );
}

function ButtonCircle1() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􀖗</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Content3() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[0] relative shrink-0 text-center tracking-[-0.4px] w-[110px] whitespace-nowrap" data-name="Content">
      <div className="flex flex-col font-['SF_Pro:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[22px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px]">$5.20</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[21px]">Estimated Cost</p>
      </div>
    </div>
  );
}

function ChargedAtHome() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Charged at home">
      <ButtonCircle1 />
      <Content3 />
    </div>
  );
}

function Pourcentage() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[350px]" data-name="Pourcentage">
      <ChargedAtStation />
      <ChargedAtHome />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative rounded-[20px] w-full" data-name="Content">
      <Pourcentage />
    </div>
  );
}

function CurrentEnergyUsage() {
  return (
    <div className="absolute backdrop-blur-[5px] bg-gradient-to-b from-[57.412%] from-[rgba(46,167,255,0)] h-[215px] left-[20px] rounded-[20px] to-[rgba(46,167,255,0.1)] top-[121px]" data-name="Current Energy Usage">
      <div className="content-stretch flex flex-col gap-[16px] h-full items-start justify-center overflow-clip p-[20px] relative rounded-[inherit]">
        <Title />
        <Content />
        <div className="h-0 relative shrink-0 w-full" data-name="Separator">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 350 1">
              <g id="Separator">
                <line stroke="url(#paint0_linear_1_7933)" style={{ mixBlendMode: "overlay" }} x2="350" y1="0.5" y2="0.5" />
              </g>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7933" x1="0" x2="356.562" y1="1.49977" y2="1.49977">
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="0.5023" stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <Content1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ButtonCircle2() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􁏃</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Content4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 text-center tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Thermostats
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        1 device
      </p>
    </div>
  );
}

function Contents() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="Contents">
      <ButtonCircle2 />
      <Content4 />
    </div>
  );
}

function Divider1() {
  return (
    <div className="h-px relative shrink-0 w-[177px]" data-name="Divider">
      <div className="absolute inset-0 mix-blend-overlay rounded-[10px]" data-name="Line" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 177 1\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.4191e-16 0.05 -8.85 3.0616e-18 88.5 0.5)\'><stop stop-color=\'rgba(255,255,255,1)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,0)\' offset=\'1\'/></radialGradient></defs></svg>')" }} />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        ON
      </p>
    </div>
  );
}

function ToggleBlue() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[57.412%] from-[rgba(46,167,255,0)] items-start p-[2px] relative rounded-[20px] shrink-0 to-[rgba(46,167,255,0.1)]" data-name="Toggle Blue">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="opacity-0 relative rounded-[32px] shrink-0 size-[28px]" data-name="Spacer" style={{ backgroundImage: "linear-gradient(135deg, rgb(15, 85, 232) 0%, rgb(157, 223, 243) 100%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      </div>
      <div className="relative rounded-[32px] shrink-0 size-[28px]" data-name="On" style={{ backgroundImage: "linear-gradient(157.51deg, rgba(2, 109, 255, 0.7) 16.752%, rgba(0, 215, 255, 0.7) 85.92%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      </div>
    </div>
  );
}

function Toggle() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Toggle">
      <Frame5 />
      <ToggleBlue />
    </div>
  );
}

function Thermostats() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center p-[20px] relative rounded-[20px] shrink-0 w-[185px]" data-name="Thermostats" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 185 212\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.998 23.353 -12.932 4.3617 32.52 9.1094)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <Contents />
      <Divider1 />
      <Toggle />
    </div>
  );
}

function ButtonCircle3() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􁷙</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Content5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 text-center tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Lighting
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        1 device
      </p>
    </div>
  );
}

function Contents1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="Contents">
      <ButtonCircle3 />
      <Content5 />
    </div>
  );
}

function Divider2() {
  return (
    <div className="h-px relative shrink-0 w-[177px]" data-name="Divider">
      <div className="absolute inset-0 mix-blend-overlay rounded-[10px]" data-name="Line" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 177 1\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.4191e-16 0.05 -8.85 3.0616e-18 88.5 0.5)\'><stop stop-color=\'rgba(255,255,255,1)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,0)\' offset=\'1\'/></radialGradient></defs></svg>')" }} />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        ON
      </p>
    </div>
  );
}

function ToggleBlue1() {
  return (
    <div className="content-stretch flex items-start p-[2px] relative rounded-[20px] shrink-0" data-name="Toggle Blue" style={{ backgroundImage: "linear-gradient(155.269deg, rgba(49, 58, 91, 0.5) 19.474%, rgba(33, 39, 61, 0.5) 83.88%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(134,113,236,0.64)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="opacity-0 relative rounded-[32px] shrink-0 size-[28px]" data-name="Spacer" style={{ backgroundImage: "linear-gradient(135deg, rgb(15, 85, 232) 0%, rgb(157, 223, 243) 100%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      </div>
      <div className="relative rounded-[32px] shrink-0 size-[28px]" data-name="On" style={{ backgroundImage: "linear-gradient(157.51deg, rgba(2, 109, 255, 0.7) 16.752%, rgba(0, 215, 255, 0.7) 85.92%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame7 />
      <ToggleBlue1 />
    </div>
  );
}

function Lighting() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center p-[20px] relative rounded-[20px] shrink-0 w-[185px]" data-name="Lighting" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 185 212\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.998 23.353 -12.932 4.3617 32.52 9.1094)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <Contents1 />
      <Divider2 />
      <Frame16 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-start justify-between left-1/2 px-[20px] top-[440px] w-[430px]">
      <Thermostats />
      <Lighting />
    </div>
  );
}

function ButtonCircle4() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􀮍</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Content6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 text-center tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Appliances
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        1 device
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
      <ButtonCircle4 />
      <Content6 />
    </div>
  );
}

function Divider3() {
  return (
    <div className="h-px relative shrink-0 w-[177px]" data-name="Divider">
      <div className="absolute inset-0 mix-blend-overlay rounded-[10px]" data-name="Line" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 177 1\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.4191e-16 0.05 -8.85 3.0616e-18 88.5 0.5)\'><stop stop-color=\'rgba(255,255,255,1)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,0)\' offset=\'1\'/></radialGradient></defs></svg>')" }} />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        ON
      </p>
    </div>
  );
}

function ToggleBlue2() {
  return (
    <div className="content-stretch flex items-start p-[2px] relative rounded-[20px] shrink-0" data-name="Toggle Blue" style={{ backgroundImage: "linear-gradient(155.269deg, rgba(49, 58, 91, 0.5) 19.474%, rgba(33, 39, 61, 0.5) 83.88%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(134,113,236,0.64)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="opacity-0 relative rounded-[32px] shrink-0 size-[28px]" data-name="Spacer" style={{ backgroundImage: "linear-gradient(135deg, rgb(15, 85, 232) 0%, rgb(157, 223, 243) 100%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      </div>
      <div className="relative rounded-[32px] shrink-0 size-[28px]" data-name="On" style={{ backgroundImage: "linear-gradient(157.51deg, rgba(2, 109, 255, 0.7) 16.752%, rgba(0, 215, 255, 0.7) 85.92%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame8 />
      <ToggleBlue2 />
    </div>
  );
}

function Heart() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center p-[20px] relative rounded-[20px] shrink-0 w-[185px]" data-name="Heart" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 185 212\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.998 23.353 -12.932 4.3617 32.52 9.1094)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <Frame4 />
      <Divider3 />
      <Frame17 />
    </div>
  );
}

function ButtonCircle5() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􀩮</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Content7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 text-center tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Wi-Fi Systems
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        1 device
      </p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
      <ButtonCircle5 />
      <Content7 />
    </div>
  );
}

function Divider4() {
  return (
    <div className="h-px relative shrink-0 w-[177px]" data-name="Divider">
      <div className="absolute inset-0 mix-blend-overlay rounded-[10px]" data-name="Line" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 177 1\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.4191e-16 0.05 -8.85 3.0616e-18 88.5 0.5)\'><stop stop-color=\'rgba(255,255,255,1)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,0)\' offset=\'1\'/></radialGradient></defs></svg>')" }} />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        ON
      </p>
    </div>
  );
}

function ToggleBlue3() {
  return (
    <div className="content-stretch flex items-start p-[2px] relative rounded-[20px] shrink-0" data-name="Toggle Blue" style={{ backgroundImage: "linear-gradient(155.269deg, rgba(49, 58, 91, 0.5) 19.474%, rgba(33, 39, 61, 0.5) 83.88%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(134,113,236,0.64)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="opacity-0 relative rounded-[32px] shrink-0 size-[28px]" data-name="Spacer" style={{ backgroundImage: "linear-gradient(135deg, rgb(15, 85, 232) 0%, rgb(157, 223, 243) 100%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      </div>
      <div className="relative rounded-[32px] shrink-0 size-[28px]" data-name="On" style={{ backgroundImage: "linear-gradient(157.51deg, rgba(2, 109, 255, 0.7) 16.752%, rgba(0, 215, 255, 0.7) 85.92%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame10 />
      <ToggleBlue3 />
    </div>
  );
}

function Heart1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center p-[20px] relative rounded-[20px] shrink-0 w-[185px]" data-name="Heart" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 185 212\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(5.998 23.353 -12.932 4.3617 32.52 9.1094)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <Frame9 />
      <Divider4 />
      <Frame18 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-start justify-between left-1/2 px-[20px] top-[671px] w-[430px]">
      <Heart />
      <Heart1 />
    </div>
  );
}

function Tab() {
  return (
    <div className="h-[40px] relative shrink-0 w-[48px]" data-name="Tab 1">
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[18px] text-[rgba(255,255,255,0.6)] text-center top-[calc(50%-10px)]">􀎞</p>
    </div>
  );
}

function Tab1() {
  return (
    <div className="h-[40px] relative shrink-0 w-[48px]" data-name="Tab 2">
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[normal] left-[calc(50%+0.5px)] not-italic text-[18px] text-[rgba(255,255,255,0.6)] text-center top-[calc(50%-10px)]">􀛦</p>
    </div>
  );
}

function ButtonVerticalStack() {
  return (
    <div className="h-[40px] relative shrink-0 w-[48px]" data-name="_Button/Vertical Stack">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[calc(50%-1px)] not-italic text-[18px] text-[rgba(255,255,255,0.6)] text-center top-1/2 tracking-[-0.72px] whitespace-nowrap">
        <p className="leading-[normal]">􀐾</p>
      </div>
    </div>
  );
}

function Tab2() {
  return (
    <div className="h-[40px] relative shrink-0 w-[48px]" data-name="Tab 4">
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[normal] left-[calc(50%+0.5px)] not-italic text-[18px] text-[rgba(255,255,255,0.6)] text-center top-[calc(50%-10px)]">􀍟</p>
    </div>
  );
}

function TabBarButtons() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex items-center justify-between left-[calc(50%-0.5px)] px-[24px] top-[calc(50%-19px)] w-[393px]" data-name="Tab Bar Buttons">
      <Tab />
      <Tab1 />
      <ButtonVerticalStack />
      <Tab2 />
    </div>
  );
}

function TabBar1() {
  return (
    <div className="-translate-x-1/2 absolute bottom-0 h-[90px] left-1/2 overflow-clip rounded-[30px] w-[430px]" data-name="Tab Bar">
      <div className="-translate-x-1/2 absolute bottom-0 h-[90px] left-1/2 w-[430px]" data-name="Base">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 430 90">
          <g data-figma-bg-blur-radius="100" id="Base">
            <path d={svgPaths.pa7e6100} fill="url(#paint0_linear_1_7622)" />
            <path d={svgPaths.pa7e6100} stroke="url(#paint1_linear_1_7622)" strokeOpacity="0.2" />
            <path d={svgPaths.pa7e6100} stroke="url(#paint2_linear_1_7622)" style={{ mixBlendMode: "overlay" }} />
          </g>
          <defs>
            <clipPath id="bgblur_0_1_7622_clip_path" transform="translate(0 0)">
              <path d={svgPaths.pa7e6100} />
            </clipPath>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7622" x1="214.453" x2="214.91" y1="-25.5" y2="90.0004">
              <stop offset="0.32144" stopColor="#151C40" />
              <stop offset="0.940255" stopColor="#080B1C" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_7622" x1="198.5" x2="198.5" y1="-4.00855e-06" y2="90">
              <stop stopColor="#17B9FF" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_7622" x1="81.5" x2="70.7851" y1="26" y2="76.5469">
              <stop stopColor="white" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute h-[38px] left-1/2 top-[-30px] w-[334px]" data-name="Glow">
        <div className="absolute inset-[-157.89%_-17.96%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 454 158">
            <g filter="url(#filter0_f_2_2285)" id="Glow" opacity="0.6">
              <ellipse cx="227" cy="79" fill="url(#paint0_linear_2_2285)" fillOpacity="0.7" rx="167" ry="19" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="158" id="filter0_f_2_2285" width="454" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_2_2285" stdDeviation="30" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_2285" x1="149.193" x2="151.143" y1="62.5909" y2="103.987">
                <stop offset="0.0532409" stopColor="#026DFF" />
                <stop offset="0.949074" stopColor="#00D7FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <TabBarButtons />
    </div>
  );
}

function Circles() {
  return (
    <div className="absolute left-0 size-[70px] top-0" data-name="Circles">
      <div className="absolute inset-[0_-14.29%_-28.57%_-14.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 90">
          <g id="Circles">
            <g data-figma-bg-blur-radius="20" filter="url(#filter0_ddd_2_2123)" id="Ellipse 1899">
              <circle cx="45" cy="35" fill="url(#paint0_linear_2_2123)" r="35" />
              <circle cx="45" cy="35" r="34.5" stroke="url(#paint1_linear_2_2123)" style={{ mixBlendMode: "overlay" }} />
            </g>
            <g filter="url(#filter1_f_2_2123)" id="Ellipse 1900">
              <circle cx="44.5" cy="35.5" fill="url(#paint2_linear_2_2123)" r="32.5" />
            </g>
            <g id="Ellipse 1902">
              <circle cx="45" cy="35" fill="url(#paint3_linear_2_2123)" r="30" />
              <circle cx="45" cy="35" r="30" stroke="url(#paint4_linear_2_2123)" style={{ mixBlendMode: "overlay" }} />
            </g>
            <g id="Group 3">
              <g filter="url(#filter2_f_2_2123)" id="Ellipse 827">
                <circle cx="45" cy="35" fill="url(#paint5_linear_2_2123)" fillOpacity="0.7" r="22" />
              </g>
              <g data-figma-bg-blur-radius="10" id="Ellipse 1902_2">
                <circle cx="45" cy="35" fill="var(--fill-0, white)" fillOpacity="0.3" r="21.5" style={{ mixBlendMode: "overlay" }} />
                <circle cx="45" cy="35" r="21.5" stroke="url(#paint6_linear_2_2123)" style={{ mixBlendMode: "overlay" }} />
              </g>
              <circle cx="45" cy="35" id="Ellipse 828" r="21.5" stroke="url(#paint7_linear_2_2123)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="110" id="filter0_ddd_2_2123" width="110" x="-10" y="-20">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="10" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_2123" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
              <feBlend in2="effect1_dropShadow_2_2123" mode="normal" result="effect2_dropShadow_2_2123" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
              <feBlend in2="effect2_dropShadow_2_2123" mode="normal" result="effect3_dropShadow_2_2123" />
              <feBlend in="SourceGraphic" in2="effect3_dropShadow_2_2123" mode="normal" result="shape" />
            </filter>
            <clipPath id="bgblur_0_2_2123_clip_path" transform="translate(10 20)">
              <circle cx="45" cy="35" r="35" />
            </clipPath>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="69" id="filter1_f_2_2123" width="69" x="10" y="1">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_2_2123" stdDeviation="1" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="64" id="filter2_f_2_2123" width="64" x="13" y="3.00002">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_2_2123" stdDeviation="5" />
            </filter>
            <clipPath id="bgblur_1_2_2123_clip_path" transform="translate(-13 -3.00002)">
              <circle cx="45" cy="35" r="21.5" />
            </clipPath>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_2123" x1="45" x2="45" y1="0" y2="74.5">
              <stop offset="0.149219" stopColor="#1861B4" />
              <stop offset="1" stopColor="#0E132A" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_2_2123" x1="45" x2="45" y1="0" y2="73">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0.07" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_2_2123" x1="44.5" x2="44" y1="3" y2="64.5">
              <stop stopColor="#009DFF" />
              <stop offset="1" stopColor="#0E132B" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_2_2123" x1="45" x2="45" y1="5" y2="61">
              <stop offset="0.115379" stopColor="#191942" />
              <stop offset="1" stopColor="#10142E" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_2_2123" x1="45" x2="45" y1="5" y2="65">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint5_linear_2_2123" x1="51.05" x2="51.6286" y1="66.5898" y2="13.0003">
              <stop offset="0.481481" stopColor="#026DFF" stopOpacity="0" />
              <stop offset="0.736111" stopColor="#026DFF" />
              <stop offset="0.949074" stopColor="#00D7FF" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint6_linear_2_2123" x1="45" x2="45" y1="13" y2="57">
              <stop stopColor="white" />
              <stop offset="0.284905" stopColor="white" stopOpacity="0" />
              <stop offset="0.828955" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint7_linear_2_2123" x1="48.85" x2="48.2714" y1="63.7692" y2="15.8209">
              <stop offset="0.856716" stopColor="#2737CF" stopOpacity="0" />
              <stop offset="1" stopColor="#BDFCFE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function SelectedTab() {
  return (
    <div className="absolute left-[42px] size-[70px] top-px" data-name="Selected Tab">
      <Circles />
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[20px] text-center text-white top-[calc(50%-12px)]">􀎞</p>
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute bottom-0 h-[101px] left-0 w-[430px]" data-name="Tab Bar">
      <TabBar1 />
      <SelectedTab />
    </div>
  );
}

function ButtonToggle() {
  return (
    <div className="absolute h-[44px] left-[320px] rounded-[32px] top-[366px] w-[90px]" data-name="Button Toggle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex gap-[10px] items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full text-center text-white">
        <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Add
        </p>
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􀅼</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[20px] py-[10px] relative rounded-[30px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.25)] shrink-0 w-[135px]" data-name="Button" style={{ backgroundImage: "linear-gradient(0.192446deg, rgba(9, 15, 38, 0.7) 28.787%, rgba(2, 109, 255, 0.7) 67.826%, rgba(0, 215, 255, 0.7) 93.489%)" }}>
      <div className="absolute backdrop-blur-[10px] bg-[rgba(255,255,255,0.3)] h-[42px] left-0 mix-blend-overlay rounded-[20px] top-0 w-[135px]" data-name="Glass">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      </div>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Devices
      </p>
    </div>
  );
}

function ButtonToggle1() {
  return (
    <div className="backdrop-blur-[10px] content-stretch flex gap-[12px] items-center justify-center overflow-clip px-[20px] py-[10px] relative rounded-[99px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] shrink-0 w-[135px]" data-name="Button Toggle">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Rooms
      </p>
    </div>
  );
}

function SegmentedControl() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[57.412%] from-[rgba(46,167,255,0)] gap-[10px] items-center left-[20px] p-[2px] rounded-[99px] to-[rgba(46,167,255,0.1)] top-[366px]" data-name="Segmented Control">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <Button />
      <ButtonToggle1 />
    </div>
  );
}

function SmartHomeDashboard() {
  return (
    <div className="absolute bg-[#080b1c] h-[932px] left-0 overflow-clip rounded-[30px] shadow-[0px_30px_60px_0px_rgba(0,0,0,0.25)] top-0 w-[430px]" data-name="Smart Home Dashboard">
      <BackgroundWeb />
      <NavigationBar />
      <CurrentEnergyUsage />
      <Frame30 />
      <Frame31 />
      <TabBar />
      <ButtonToggle />
      <SegmentedControl />
    </div>
  );
}

function Bg() {
  return (
    <div className="absolute h-[605px] left-[10px] top-[162px] w-[255px]" data-name="BG">
      <div className="absolute inset-[-13.8%_-67.29%_-28.36%_-67.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 598.184 860.099">
          <g id="BG">
            <g filter="url(#filter0_f_1_5261)" id="Ellipse 1904">
              <circle cx="299.092" cy="561.007" fill="url(#paint0_linear_1_5261)" r="127.5" />
            </g>
            <g filter="url(#filter1_f_1_5261)" id="Ellipse 1903">
              <ellipse cx="293.592" cy="152.507" fill="var(--fill-0, #141680)" rx="62" ry="69" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="598.184" id="filter0_f_1_5261" width="598.184" x="0" y="261.915">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_5261" stdDeviation="85.7961" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="305.015" id="filter1_f_1_5261" width="291.015" x="148.085" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_5261" stdDeviation="41.7537" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_5261" x1="203.049" x2="389.199" y1="462.437" y2="688.749">
              <stop stopColor="#141680" />
              <stop offset="1" stopColor="#141680" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Mode() {
  return (
    <div className="-translate-x-1/2 absolute left-1/2 size-[380px] top-0" data-name="Mode">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 380 380">
        <g id="Mode">
          <mask height="380" id="mask0_1_4789" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="380" x="0" y="0">
            <g data-figma-bg-blur-radius="10" id="Subtract">
              <mask fill="white" id="path-1-inside-1_1_4789">
                <path d={svgPaths.p1f8bd500} />
              </mask>
              <path d={svgPaths.p1f8bd500} fill="url(#paint0_linear_1_4789)" fillOpacity="0.1" />
              <path d={svgPaths.p12db3880} fill="url(#paint1_linear_1_4789)" fillOpacity="0.6" mask="url(#path-1-inside-1_1_4789)" />
            </g>
          </mask>
          <g mask="url(#mask0_1_4789)">
            <g data-figma-bg-blur-radius="10" id="Subtract_2">
              <mask fill="white" id="path-3-inside-2_1_4789">
                <path d={svgPaths.p35a0f0} />
              </mask>
              <path d={svgPaths.p35a0f0} fill="url(#paint2_linear_1_4789)" fillOpacity="0.1" />
              <path d={svgPaths.pf1ac000} fill="url(#paint3_linear_1_4789)" fillOpacity="0.6" mask="url(#path-3-inside-2_1_4789)" style={{ mixBlendMode: "overlay" }} />
            </g>
            <g id="Selected">
              <path d={svgPaths.p32701d00} fill="url(#paint4_radial_1_4789)" style={{ mixBlendMode: "overlay" }} />
            </g>
          </g>
        </g>
        <defs>
          <clipPath id="bgblur_0_1_4789_clip_path" transform="translate(0 0)">
            <path d={svgPaths.p1f8bd500} />
          </clipPath>
          <clipPath id="bgblur_1_1_4789_clip_path" transform="translate(10 10)">
            <path d={svgPaths.p35a0f0} />
          </clipPath>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_4789" x1="190" x2="190" y1="0" y2="380">
            <stop offset="0.722212" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_4789" x1="190" x2="190" y1="0" y2="380">
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_4789" x1="190" x2="190" y1="0" y2="380">
            <stop offset="0.752501" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_1_4789" x1="190" x2="190" y1="0" y2="380">
            <stop offset="0.178773" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(191.756 300.948) rotate(-88.8138) scale(169.697 155.32)" gradientUnits="userSpaceOnUse" id="paint4_radial_1_4789" r="1">
            <stop stopColor="white" stopOpacity="0.8" />
            <stop offset="0.137165" stopColor="white" stopOpacity="0.4" />
            <stop offset="0.712665" stopColor="white" stopOpacity="0.1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-1/2 top-[calc(50%-30.5px)]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[282px] top-[calc(50%-30.5px)]" data-name="Base">
        <div className="absolute inset-[-0.35%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 284 284">
            <g id="Base">
              <circle cx="142" cy="142" fill="url(#paint0_radial_1_4634)" fillOpacity="0.5" r="141" />
              <circle cx="142" cy="142" r="141.5" stroke="url(#paint1_linear_1_4634)" strokeOpacity="0.2" />
              <circle cx="142" cy="142" r="141.5" stroke="url(#paint2_linear_1_4634)" strokeOpacity="0.2" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="translate(50.5703 13.1172) rotate(73.5995) scale(323.816 205.483)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_4634" r="1">
                <stop stopColor="#2EA7FF" stopOpacity="0.5" />
                <stop offset="0.780575" stopColor="#1C1B33" stopOpacity="0.2" />
              </radialGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_4634" x1="142" x2="142" y1="1" y2="283">
                <stop stopColor="#17B9FF" />
                <stop offset="0.47469" stopColor="#17B9FF" />
                <stop offset="0.787417" stopColor="#17B9FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_4634" x1="59.9179" x2="239.189" y1="25.1714" y2="237.679">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[280px] top-[calc(50%-30.5px)]" data-name="Dash">
        <img alt="" className="block max-w-none size-full" height="280" src={imgDash} width="280" />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[280px] top-[calc(50%-30.5px)]" data-name="Dash">
        <img alt="" className="block max-w-none size-full" height="280" src={imgDash1} width="280" />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[230px] top-[calc(50%-30.5px)]" data-name="Outline">
        <div className="absolute inset-[-0.87%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 234 234">
            <circle cx="117" cy="117" id="Outline" r="116" stroke="url(#paint0_linear_1_4324)" strokeWidth="2" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_4324" x1="53.5" x2="180" y1="16" y2="225.5">
                <stop stopColor="#0097FF" />
                <stop offset="1" stopColor="#0097FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[220px] top-[calc(50%-30.5px)]" data-name="Dash">
        <div className="absolute inset-[-0.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 222 222">
            <g id="Dash">
              <circle cx="111" cy="111" r="110" stroke="var(--stroke-0, white)" strokeDasharray="30 8" strokeWidth="2" style={{ mixBlendMode: "overlay" }} />
            </g>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-[calc(50%+0.14px)] size-[243.276px] top-[calc(50%-31.62px)]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="-rotate-10 flex-none">
          <div className="relative size-[210px]" data-name="Dash">
            <div className="absolute inset-[-0.48%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 212 212">
                <g id="Dash">
                  <circle cx="106" cy="106" r="105" stroke="url(#paint0_linear_1_4169)" strokeDasharray="27.82 7.42" strokeWidth="2" style={{ mixBlendMode: "overlay" }} />
                </g>
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_4169" x1="4.73646" x2="209.278" y1="75.1815" y2="112.651">
                    <stop stopColor="white" />
                    <stop offset="0.512501" stopColor="white" stopOpacity="0" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[190px] top-[calc(50%-30.5px)]" data-name="Dash">
        <div className="absolute inset-[-2.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 200 200">
            <g id="Dash">
              <g clipPath="url(#paint0_angular_1_4014_clip_path)" data-figma-skip-parse="true">
                <g transform="matrix(0 0.095 -0.095 0 100 100)" />
              </g>
              <path d={svgPaths.pdc81a80} data-figma-gradient-fill="{'type':'GRADIENT_ANGULAR','stops':[{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':0.035987611860036850},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':1.0},'position':0.49815416336059570},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':0.96091020107269287}],'stopsVar':[],'transform':{'m00':1.1634144914270637e-14,'m01':-190.0,'m02':195.0,'m10':190.0,'m11':1.1634144914270637e-14,'m12':5.0},'opacity':1.0,'blendMode':'OVERLAY','visible':true}" style={{ mixBlendMode: "overlay" }} />
              <path d={svgPaths.pdc81a80} fill="url(#paint1_linear_1_4014)" fillOpacity="0.2" />
            </g>
            <defs>
              <clipPath id="paint0_angular_1_4014_clip_path">
                <path d={svgPaths.pdc81a80} />
              </clipPath>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_4014" x1="100" x2="100" y1="5" y2="195">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[160px] top-[calc(50%-30.5px)]" data-name="Glass front">
        <div className="absolute inset-[-0.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 162 162">
            <circle cx="81" cy="81" fill="url(#paint0_linear_2_1968)" id="Glass front" r="80.5" stroke="url(#paint1_linear_2_1968)" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_1968" x1="81.0103" x2="80.9862" y1="-11.9681" y2="162.079">
                <stop stopColor="#134B96" />
                <stop offset="0.890225" stopColor="#0F214A" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_2_1968" x1="1" x2="164.059" y1="80.8569" y2="80.8569">
                <stop offset="0.10855" stopColor="#17B9FF" stopOpacity="0" />
                <stop offset="0.51354" stopColor="#17B9FF" />
                <stop offset="0.908406" stopColor="#17B9FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Selected() {
  return (
    <div className="absolute h-[40px] left-[193px] top-[241px] w-[46px]" data-name="Selected">
      <div className="absolute inset-[-15%_-21.45%_-40%_-19.48%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64.8244 62">
          <g id="Selected">
            <g id="Selected_2">
              <g filter="url(#filter0_f_1_3851)" id="Rectangle">
                <rect height="32" rx="16" stroke="url(#paint0_linear_1_3851)" strokeWidth="4" width="35.0127" x="14.9059" y="6" />
              </g>
              <g filter="url(#filter1_f_1_3851)" id="Ellipse 825">
                <ellipse cx="32.4122" cy="33" fill="var(--fill-0, #3288F4)" fillOpacity="0.46" rx="16.4122" ry="13" />
              </g>
            </g>
            <g id="Selected_3">
              <mask fill="white" id="path-3-inside-1_1_3851">
                <path d={svgPaths.p1ef33cf0} />
              </mask>
              <path d={svgPaths.p1ef33cf0} fill="url(#paint1_linear_1_3851)" />
              <path d={svgPaths.p1ef33cf0} fill="var(--fill-1, #37F4FA)" />
              <path d={svgPaths.p3b9b6b00} fill="var(--stroke-0, white)" mask="url(#path-3-inside-1_1_3851)" style={{ mixBlendMode: "overlay" }} />
            </g>
            <g id="Selected_4">
              <path d={svgPaths.p19fe9000} id="Line 8" stroke="url(#paint2_linear_1_3851)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44" id="filter0_f_1_3851" width="47.0127" x="8.90585" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_3851" stdDeviation="2" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="58" id="filter1_f_1_3851" width="64.8244" x="0" y="4">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_1_3851" stdDeviation="8" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_3851" x1="32.4122" x2="32.8692" y1="6" y2="37.5013">
              <stop offset="0.894748" stopColor="#3342FF" stopOpacity="0" />
              <stop offset="1" stopColor="#37F4FA" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_3851" x1="34.1835" x2="60.26" y1="4.99622" y2="24.5123">
              <stop stopColor="#C441F4" />
              <stop offset="1" stopColor="#00DAEA" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_3851" x1="53.4593" x2="11.4594" y1="37.0156" y2="36.5117">
              <stop stopColor="#7744FA" stopOpacity="0" />
              <stop offset="0.12874" stopColor="#2B8FF3" />
              <stop offset="0.504545" stopColor="#37F4FA" />
              <stop offset="0.877202" stopColor="#2B8FF3" />
              <stop offset="1" stopColor="#7A41FA" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[74px] top-[52px]">
      <Group />
      <Selected />
      <p className="-translate-x-1/2 absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[34px] left-1/2 text-[28px] text-center text-white top-[calc(50%-48.5px)] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        23°C
      </p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[25px] top-0">
      <Mode />
      <Group1 />
    </div>
  );
}

function Selected1() {
  return (
    <div className="absolute contents left-[100px] top-[76px]" data-name="Selected">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[230px] top-[calc(50%-32.5px)]" data-name="Blur">
        <div className="absolute inset-[-13.04%_22.29%_-12.96%_-13.04%]">
          <img alt="" className="block max-w-none size-full" height="289.805" src={imgBlur} width="208.744" />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[230px] top-[calc(50%-32.5px)]" data-name="Progress">
        <div className="absolute inset-[0_17.02%_0_0]">
          <img alt="" className="block max-w-none size-full" height="229.805" src={imgProgress} width="190.859" />
        </div>
      </div>
      <div className="absolute left-[274px] size-[30px] top-[96px]">
        <div className="absolute inset-[0_-33.33%_-66.67%_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
            <g data-figma-bg-blur-radius="10" filter="url(#filter0_d_2_1658)" id="Ellipse 1905">
              <circle cx="25" cy="15" fill="url(#paint0_linear_2_1658)" fillOpacity="0.7" r="15" shapeRendering="crispEdges" />
              <circle cx="25" cy="15" r="14.5" shapeRendering="crispEdges" stroke="url(#paint1_linear_2_1658)" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="60" id="filter0_d_2_1658" width="50" x="0" y="-10">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="10" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_1658" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_1658" mode="normal" result="shape" />
              </filter>
              <clipPath id="bgblur_0_2_1658_clip_path" transform="translate(0 10)">
                <circle cx="25" cy="15" r="15" />
              </clipPath>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_1658" x1="18.0114" x2="29.5874" y1="2.04545" y2="30.0062">
                <stop offset="0.0532409" stopColor="#026DFF" />
                <stop offset="0.949074" stopColor="#00D7FF" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_2_1658" x1="25" x2="25" y1="0" y2="30">
                <stop stopColor="white" stopOpacity="0.5" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ProgressBar1() {
  return (
    <div className="-translate-x-1/2 absolute contents left-1/2 top-0" data-name="Progress bar">
      <Group2 />
      <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[38px] text-[13px] text-[rgba(255,255,255,0.7)] top-[187px] tracking-[-0.4px] w-[26px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        10°
      </p>
      <p className="-translate-x-full absolute font-['SF_Pro:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[392px] text-[13px] text-[rgba(255,255,255,0.7)] text-right top-[187px] tracking-[-0.4px] w-[26px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        30°
      </p>
      <p className="-translate-x-full absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[18px] left-[calc(50%+12px)] text-[13px] text-[rgba(255,255,255,0.7)] text-right top-[22px] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        20°
      </p>
      <Selected1 />
    </div>
  );
}

function MinusThin() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Minus Thin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Minus Thin">
          <path d="M3 12H21" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute content-stretch flex items-start left-[10px] p-[10px] top-[42px]" data-name="Icon">
      <MinusThin />
    </div>
  );
}

function MinusButton() {
  return (
    <div className="h-[120px] relative shrink-0 w-[90px]" data-name="Minus Button">
      <div className="absolute flex h-[120px] items-center justify-center left-0 top-0 w-[90px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[90px] relative w-[120px]" data-name="Base">
            <div className="absolute inset-[8.87%_0.68%_0_0.77%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 118.266 82.0065">
                <g data-figma-bg-blur-radius="10" id="Base">
                  <path d={svgPaths.p213b9b00} fill="url(#paint0_linear_1_3231)" fillOpacity="0.1" />
                  <path d={svgPaths.p20b40da0} stroke="url(#paint1_linear_1_3231)" strokeOpacity="0.6" style={{ mixBlendMode: "overlay" }} />
                </g>
                <defs>
                  <clipPath id="bgblur_0_1_3231_clip_path" transform="translate(10 10)">
                    <path d={svgPaths.p213b9b00} />
                  </clipPath>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_3231" x1="75.0807" x2="73.113" y1="79.0179" y2="-34.9826">
                    <stop stopColor="white" stopOpacity="0" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_3231" x1="65.5031" x2="66.4383" y1="78.4068" y2="-29.0132">
                    <stop stopColor="white" stopOpacity="0" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Icon />
    </div>
  );
}

function PlusThin() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Plus Thin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Plus Thin">
          <path d="M12 3V21" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
          <path d="M3 12H21" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function PlusButton1() {
  return (
    <div className="absolute content-stretch flex items-start left-[10px] p-[10px] top-[42px]" data-name="Plus Button">
      <PlusThin />
    </div>
  );
}

function PlusButton() {
  return (
    <div className="h-[120px] relative w-[90px]" data-name="Plus Button">
      <div className="absolute flex h-[120px] items-center justify-center left-0 top-0 w-[90px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[90px] relative w-[120px]" data-name="Base">
            <div className="absolute inset-[8.87%_0.68%_0_0.77%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 118.266 82.0065">
                <g data-figma-bg-blur-radius="10" id="Base">
                  <path d={svgPaths.p213b9b00} fill="url(#paint0_linear_1_3076)" fillOpacity="0.1" />
                  <path d={svgPaths.p20b40da0} stroke="url(#paint1_linear_1_3076)" strokeOpacity="0.6" style={{ mixBlendMode: "overlay" }} />
                </g>
                <defs>
                  <clipPath id="bgblur_0_1_3076_clip_path" transform="translate(10 10)">
                    <path d={svgPaths.p213b9b00} />
                  </clipPath>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_3076" x1="66.0038" x2="59.1207" y1="82.2777" y2="-58.984">
                    <stop stopColor="white" stopOpacity="0" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_3076" x1="65.5031" x2="66.4383" y1="78.4068" y2="-29.0132">
                    <stop stopColor="white" stopOpacity="0" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <PlusButton1 />
    </div>
  );
}

function TemperatureAdjustmentControls() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-start justify-between left-[calc(50%+0.5px)] top-[327px] w-[393px]" data-name="Temperature Adjustment Controls">
      <MinusButton />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <PlusButton />
        </div>
      </div>
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="-translate-x-1/2 absolute h-[447px] left-1/2 top-[54px] w-[430px]" data-name="Progress bar">
      <ProgressBar1 />
      <TemperatureAdjustmentControls />
      <p className="-translate-x-1/2 absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[30px] left-[111px] text-[20px] text-[rgba(255,255,255,0.3)] text-center top-[302px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        􀇥
      </p>
      <p className="-translate-x-1/2 absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[30px] left-[321.5px] text-[16px] text-[rgba(255,255,255,0.3)] text-center top-[302px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        􀙬
      </p>
      <p className="-translate-x-1/2 absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] left-1/2 text-[20px] text-center text-white top-[346px] tracking-[-0.8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        􀇬
      </p>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[20px] py-[10px] relative rounded-[30px] shrink-0 w-[390px]" data-name="Button" style={{ backgroundImage: "linear-gradient(0.0666161deg, rgba(9, 15, 38, 0.7) 28.787%, rgba(2, 109, 255, 0.7) 67.826%, rgba(0, 215, 255, 0.7) 93.489%)" }}>
      <div className="absolute backdrop-blur-[10px] bg-[rgba(255,255,255,0.3)] h-[42px] left-0 mix-blend-overlay rounded-[20px] top-0 w-[390px]" data-name="Glass">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      </div>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Thermostat Schedule
      </p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="backdrop-blur-[10px] relative rounded-[5px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] shrink-0 size-[44px]">
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[18px] left-1/2 not-italic text-[24px] text-center text-white top-[calc(50%-9px)]">􀴿</p>
    </div>
  );
}

function Mode1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[10px] py-[20px] relative rounded-[16px] shrink-0 w-[82px]" data-name="Mode" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 82 109\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(2.6586 12.007 -5.7319 2.2425 14.414 4.6836)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border-[1.061px] border-solid border-white inset-[-1.061px] pointer-events-none rounded-[17.061px]" />
      <Frame21 />
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Mode
      </p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="backdrop-blur-[10px] relative rounded-[10px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] shrink-0 size-[44px]">
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[18px] left-1/2 not-italic text-[24px] text-center text-white top-[calc(50%-9px)]">􁃚</p>
    </div>
  );
}

function Humidity() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[10px] py-[20px] relative rounded-[16px] shrink-0 w-[82px]" data-name="Humidity" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 82 109\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(2.6586 12.007 -5.7319 2.2425 14.414 4.6836)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border-[1.061px] border-solid border-white inset-[-1.061px] pointer-events-none rounded-[17.061px]" />
      <Frame22 />
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Humidity
      </p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex items-start left-[calc(50%-0.33px)] p-[10px] top-1/2">
      <p className="font-['SF_Pro_Text:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[24px] text-center text-white">􁁋</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="backdrop-blur-[10px] relative rounded-[10px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] shrink-0 size-[44px]">
      <Frame25 />
    </div>
  );
}

function Fan() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[10px] py-[20px] relative rounded-[16px] shrink-0 w-[82px]" data-name="Fan" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 82 109\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(2.6586 12.007 -5.7319 2.2425 14.414 4.6836)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border-[1.061px] border-solid border-white inset-[-1.061px] pointer-events-none rounded-[17.061px]" />
      <Frame23 />
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Fan
      </p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="backdrop-blur-[10px] relative rounded-[10px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] shrink-0 size-[44px]">
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[18px] left-[calc(50%+0.5px)] not-italic text-[24px] text-center text-white top-[calc(50%-9px)]">􀐱</p>
    </div>
  );
}

function ChargingHistory() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Charging History">
      <Frame24 />
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Timer
      </p>
    </div>
  );
}

function Timer() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[10px] py-[20px] relative rounded-[16px] shrink-0 w-[82px]" data-name="Timer" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 82 109\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(2.6586 12.007 -5.7319 2.2425 14.414 4.6836)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border-[1.061px] border-solid border-white inset-[-1.061px] pointer-events-none rounded-[17.061px]" />
      <ChargingHistory />
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Menu">
      <Mode1 />
      <Humidity />
      <Fan />
      <Timer />
    </div>
  );
}

function Controls() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[390px]" data-name="Controls">
      <Menu />
    </div>
  );
}

function Contents2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[30px] items-start left-[20px] top-[521px]" data-name="Contents">
      <Button1 />
      <Controls />
    </div>
  );
}

function Time1() {
  return (
    <div className="-translate-y-1/2 absolute h-[54px] left-0 right-[64.89%] top-1/2" data-name="Time">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] inset-[33.96%_34.91%_25.3%_38.28%] leading-[22px] text-[17px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Battery1() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[33.33%] contents left-[calc(50%+24.43px)] top-[42.59%]" data-name="Battery">
      <div className="-translate-x-1/2 absolute border border-solid border-white bottom-[33.33%] left-[calc(50%+23.27px)] opacity-35 rounded-[4.3px] top-[42.59%] w-[25px]" data-name="Border" />
      <div className="-translate-x-1/2 absolute bottom-[41.01%] left-[calc(50%+37.43px)] top-[51.45%] w-[1.328px]" data-name="Cap">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.32804 4.07547">
          <path d={svgPaths.p193f1400} fill="var(--fill-0, white)" id="Cap" opacity="0.4" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-[37.04%] left-[calc(50%+23.27px)] rounded-[2.5px] top-[46.3%] w-[21px]" data-name="Capacity" />
    </div>
  );
}

function Levels1() {
  return (
    <div className="-translate-y-1/2 absolute h-[54px] left-[63.61%] right-0 top-1/2" data-name="Levels">
      <Battery1 />
      <div className="-translate-x-1/2 absolute bottom-[33.4%] left-[calc(50%-4.96px)] top-[43.77%] w-[17.142px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
          <path clipRule="evenodd" d={svgPaths.p1fac3f80} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[33.77%] left-[calc(50%-30.63px)] top-[43.58%] w-[19.2px]" data-name="Cellular Connection">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
          <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, white)" fillRule="evenodd" id="Cellular Connection" />
        </svg>
      </div>
    </div>
  );
}

function StatusBarIPhone() {
  return (
    <div className="h-[54px] relative shrink-0 w-[430px]" data-name="Status Bar - iPhone">
      <Time1 />
      <Levels1 />
    </div>
  );
}

function ButtonCircle6() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.72px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          􀆉
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ButtonCircle7() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.72px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          􀍟
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex items-start justify-between px-[20px] relative shrink-0 w-[430px]" data-name="Navigation">
      <ButtonCircle6 />
      <ButtonCircle7 />
    </div>
  );
}

function NavigationBar1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-px" data-name="Navigation Bar">
      <StatusBarIPhone />
      <Navigation />
    </div>
  );
}

function Content8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[22px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        -1°C
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Outdoor
      </p>
    </div>
  );
}

function Outdoor() {
  return (
    <div className="content-stretch flex gap-[20px] items-center justify-center overflow-clip p-[20px] relative rounded-[10px] shrink-0 text-center w-[195px]" data-name="Outdoor">
      <p className="font-['SF_Pro_Text:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[24px] text-white">􁷐</p>
      <Content8 />
    </div>
  );
}

function Divider5() {
  return (
    <div className="h-full relative w-[89px]" data-name="Divider">
      <div className="absolute inset-0 mix-blend-overlay rounded-[10px]" data-name="Line" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 89 1\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(2.7248e-16 0.05 -4.45 3.0616e-18 44.5 0.5)\'><stop stop-color=\'rgba(255,255,255,1)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,0)\' offset=\'1\'/></radialGradient></defs></svg>')" }} />
    </div>
  );
}

function Content9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[22px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        20°C
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Current
      </p>
    </div>
  );
}

function Current() {
  return (
    <div className="content-stretch flex gap-[20px] items-center justify-center overflow-clip p-[20px] relative rounded-[10px] shrink-0 text-center w-[195px]" data-name="Current">
      <p className="font-['SF_Pro_Text:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[24px] text-white">􀇬</p>
      <Content9 />
    </div>
  );
}

function Top() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip relative rounded-[10px] shrink-0 w-full" data-name="Top">
      <Outdoor />
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-px" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none h-full">
            <Divider5 />
          </div>
        </div>
      </div>
      <Current />
    </div>
  );
}

function Divider6() {
  return (
    <div className="h-px relative shrink-0 w-[390px]" data-name="Divider">
      <div className="absolute inset-0 mix-blend-overlay rounded-[10px]" data-name="Line" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 390 1\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(1.194e-15 0.05 -19.5 3.0616e-18 195 0.5)\'><stop stop-color=\'rgba(255,255,255,1)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,0)\' offset=\'1\'/></radialGradient></defs></svg>')" }} />
    </div>
  );
}

function Content10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[22px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        54%
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Humidity
      </p>
    </div>
  );
}

function Humidity1() {
  return (
    <div className="content-stretch flex gap-[20px] items-center justify-center overflow-clip p-[20px] relative rounded-[10px] shrink-0 text-center w-[195px]" data-name="Humidity">
      <p className="font-['SF_Pro_Text:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[24px] text-white">􀠑</p>
      <Content10 />
    </div>
  );
}

function Divider7() {
  return (
    <div className="h-full relative w-[89px]" data-name="Divider">
      <div className="absolute inset-0 mix-blend-overlay rounded-[10px]" data-name="Line" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 89 1\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(2.7248e-16 0.05 -4.45 3.0616e-18 44.5 0.5)\'><stop stop-color=\'rgba(255,255,255,1)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,0)\' offset=\'1\'/></radialGradient></defs></svg>')" }} />
    </div>
  );
}

function Content11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 tracking-[-0.4px]" data-name="Content">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[22px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        80%
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Battery
      </p>
    </div>
  );
}

function BatteryLife() {
  return (
    <div className="content-stretch flex gap-[20px] items-center justify-center overflow-clip p-[20px] relative rounded-[10px] shrink-0 text-center w-[195px]" data-name="Battery life">
      <p className="font-['SF_Pro_Text:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[24px] text-white">􀢋</p>
      <Content11 />
    </div>
  );
}

function Bottom() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip relative rounded-[10px] shrink-0 w-full" data-name="Bottom">
      <Humidity1 />
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-px" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none h-full">
            <Divider7 />
          </div>
        </div>
      </div>
      <BatteryLife />
    </div>
  );
}

function Contents3() {
  return (
    <div className="-translate-x-1/2 absolute left-1/2 rounded-[20px] top-[732px]" data-name="Contents" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 391 179\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(12.677 19.718 -27.331 3.6827 68.73 7.6914)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
        <Top />
        <Divider6 />
        <Bottom />
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ThermostatController() {
  return (
    <div className="absolute bg-[#080b1c] h-[932px] left-[490px] overflow-clip rounded-[30px] shadow-[0px_30px_60px_0px_rgba(0,0,0,0.25)] top-0 w-[430px]" data-name="Thermostat Controller">
      <Bg />
      <ProgressBar />
      <Contents2 />
      <NavigationBar1 />
      <Contents3 />
    </div>
  );
}

function BackgroundWeb1() {
  return (
    <div className="absolute h-[932px] left-[-507px] overflow-clip top-0 w-[838px]" data-name="Background Web 1">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute blur-[58.194px] h-[523.75px] left-1/2 top-1/2 w-[838px]" data-name="Background">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgBackground} />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(258.949deg, rgba(37, 40, 93, 0) 11.028%, rgba(12, 36, 137, 0.75) 53.424%)" }} />
        </div>
      </div>
    </div>
  );
}

function Trophy() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Trophy">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Trophy">
          <path d={svgPaths.p112d5e00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p12cd9b00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pe376d80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d045280} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p24894f00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1f269c00} id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCircle8() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <Trophy />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Energy Consumption Tracker
      </p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
      <ButtonCircle8 />
      <Frame12 />
    </div>
  );
}

function ArrowRight() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Arrow Right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Arrow Right">
          <path d="M14 8H2" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10 4L14 8L10 12" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCircle9() {
  return (
    <div className="backdrop-blur-[10px] bg-[rgba(0,0,0,0.5)] relative rounded-[32px] shrink-0 size-[36px]" data-name="Button Circle">
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <ArrowRight />
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function TitleAndNavigation() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Title and Navigation">
      <Frame11 />
      <ButtonCircle9 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        165 kWh
      </p>
    </div>
  );
}

function Move() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Move">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Monthly Energy Usage
      </p>
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] opacity-91 relative shrink-0 text-[17px] text-white tracking-[-0.4px] w-[129px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Reduce usage to 300 kWh
      </p>
    </div>
  );
}

function Steps() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Steps">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Monthly Goal
      </p>
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] opacity-91 relative shrink-0 text-[17px] text-white tracking-[-0.4px] w-[129px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        45% achieved
      </p>
    </div>
  );
}

function Steps1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Steps">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[15px] text-[rgba(255,255,255,0.6)] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Progress
      </p>
      <Frame3 />
    </div>
  );
}

function Content12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-name="Content">
      <Move />
      <Steps />
      <Steps1 />
    </div>
  );
}

function Chart1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%+0.5px)] top-[calc(50%-0.25px)]" data-name="Chart">
      <div className="-translate-x-1/2 absolute left-1/2 size-[160px] top-0" data-name="Ring">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 160 160">
          <path d={svgPaths.p10a71100} fill="var(--fill-0, #1B1F2E)" id="Ring" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute flex items-center justify-center left-[calc(50%+1px)] size-[160px] top-[-0.5px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "96" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="relative size-[160px]" data-name="Progess 3">
            <div className="absolute inset-[0_2.65%_42.74%_0]">
              <img alt="" className="block max-w-none size-full" height="91.612" src={imgProgess3} width="155.76" />
            </div>
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[36.044px] left-[calc(50%+1px)] text-[29.89px] text-center text-white top-[calc(50%-18px)] tracking-[-0.3516px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        45%
      </p>
    </div>
  );
}

function Chart() {
  return (
    <div className="relative shrink-0 size-[160px]" data-name="chart">
      <Chart1 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Content12 />
      <Chart />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[350px]">
      <TitleAndNavigation />
      <Frame26 />
    </div>
  );
}

function EnergyConsumptionTracker() {
  return (
    <div className="backdrop-blur-[10px] bg-gradient-to-b from-[57.412%] from-[rgba(46,167,255,0)] relative rounded-[20px] shrink-0 to-[rgba(46,167,255,0.1)]" data-name="Energy Consumption Tracker">
      <div className="content-stretch flex items-center overflow-clip p-[20px] relative rounded-[inherit]">
        <Frame27 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function ButtonCircle10() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.72px] whitespace-nowrap">
          <p className="leading-[normal]">􀐾</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Energy Consumption Statistics
      </p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
      <ButtonCircle10 />
      <Frame14 />
    </div>
  );
}

function ArrowRight1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Arrow Right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Arrow Right">
          <path d="M14 8H2" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10 4L14 8L10 12" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCircle11() {
  return (
    <div className="backdrop-blur-[10px] bg-[rgba(0,0,0,0.5)] relative rounded-[32px] shrink-0 size-[36px]" data-name="Button Circle">
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <ArrowRight1 />
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[30px] items-center justify-center relative shrink-0 w-full">
      <Frame13 />
      <ButtonCircle11 />
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Down">
          <path d="M4 8L12 16L20 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function ButtonToggle2() {
  return (
    <div className="backdrop-blur-[10px] bg-[rgba(0,0,0,0.5)] h-[36px] relative rounded-[20px] shrink-0" data-name="Button Toggle">
      <div className="content-stretch flex gap-[12px] h-full items-center justify-center overflow-clip p-[10px] relative rounded-[inherit]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Monthly</p>
        <ChevronDown />
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[15px] h-[36px] items-center justify-center relative shrink-0">
      <ButtonToggle2 />
    </div>
  );
}

function KWh() {
  return (
    <div className="content-stretch flex flex-col font-['SF_Pro_Text:Regular',sans-serif] gap-[21px] items-start leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.7)]" data-name="kWh">
      <p className="relative shrink-0">100 kWh</p>
      <p className="relative shrink-0">75 kWh</p>
      <p className="relative shrink-0">50 kWh</p>
      <p className="relative shrink-0">25 kWh</p>
    </div>
  );
}

function Lines() {
  return (
    <div className="-translate-y-1/2 absolute h-[116.758px] left-[-10px] right-[-10px] top-[calc(50%-0.62px)]" data-name="Lines">
      <div className="absolute inset-[-0.86%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 296 117.758">
          <g id="Lines">
            <g id="Line 1">
              <line stroke="var(--stroke-0, white)" strokeOpacity="0.1" style={{ mixBlendMode: "overlay" }} x2="296" y1="0.5" y2="0.5" />
            </g>
            <g id="Line 2">
              <line stroke="var(--stroke-0, white)" strokeOpacity="0.1" style={{ mixBlendMode: "overlay" }} x2="296" y1="39.5" y2="39.5" />
            </g>
            <g id="Line 3">
              <line stroke="var(--stroke-0, white)" strokeOpacity="0.1" style={{ mixBlendMode: "overlay" }} x2="296" y1="78.5" y2="78.5" />
            </g>
            <g id="Line 4">
              <line stroke="var(--stroke-0, white)" strokeOpacity="0.1" style={{ mixBlendMode: "overlay" }} x2="296" y1="117.258" y2="117.258" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[7px] top-[18px]">
      <div className="absolute left-[7px] size-[4px] top-[76px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 1911" r="2" />
        </svg>
      </div>
      <div className="absolute left-[46px] size-[4px] top-[36px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 1911" r="2" />
        </svg>
      </div>
      <div className="absolute left-[85px] size-[4px] top-[77px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 1911" r="2" />
        </svg>
      </div>
      <div className="absolute left-[128px] size-[4px] top-[18px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 1911" r="2" />
        </svg>
      </div>
      <div className="absolute left-[171px] size-[4px] top-[62px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 1911" r="2" />
        </svg>
      </div>
      <div className="absolute left-[201px] size-[4px] top-[97px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 1911" r="2" />
        </svg>
      </div>
      <div className="absolute left-[241px] size-[4px] top-[76px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 1911" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[-10px] top-[18px]">
      <div className="absolute h-[97.5px] left-[-10px] top-[20px] w-[292.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 292.5 97.5">
          <path d={svgPaths.p4e4a880} fill="url(#paint0_linear_1_4479)" id="Vector 208" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_4479" x1="148" x2="153.5" y1="-72.5" y2="96.0001">
              <stop stopColor="#17B9FF" />
              <stop offset="1" stopColor="#17B9FF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute h-[96px] left-[-9.52px] top-[20px] w-[292.024px]">
        <div className="absolute inset-[-0.52%_-0.14%_-0.28%_-0.17%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 292.946 96.7681">
            <path d={svgPaths.p1be0e680} id="Vector 209" stroke="var(--stroke-0, #17B9FF)" />
          </svg>
        </div>
      </div>
      <Group3 />
    </div>
  );
}

function Chart4() {
  return (
    <div className="flex-[1_0_0] h-[118px] min-h-px min-w-px overflow-clip relative" data-name="Chart">
      <Lines />
      <Group4 />
    </div>
  );
}

function Content13() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Content">
      <KWh />
      <Chart4 />
    </div>
  );
}

function Chart3() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-end relative shrink-0 w-full" data-name="Chart">
      <Frame33 />
      <Content13 />
    </div>
  );
}

function Days() {
  return (
    <div className="content-stretch flex font-['SF_Pro_Text:Regular',sans-serif] items-start justify-between not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] w-[278px]" data-name="Days">
      <div className="flex flex-col justify-center leading-[0] relative shrink-0 whitespace-nowrap">
        <p className="leading-[18px]">Jan</p>
      </div>
      <p className="leading-[18px] relative shrink-0">Feb</p>
      <p className="leading-[18px] relative shrink-0">Mar</p>
      <p className="leading-[18px] relative shrink-0">Apr</p>
      <p className="leading-[18px] relative shrink-0">May</p>
      <p className="leading-[18px] relative shrink-0">Jun</p>
      <p className="leading-[18px] relative shrink-0">Jul</p>
    </div>
  );
}

function Chart2() {
  return (
    <div className="backdrop-blur-[10px] content-stretch flex flex-col gap-[15px] items-end overflow-clip relative rounded-[10px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Chart">
      <Chart3 />
      <Days />
    </div>
  );
}

function Frame32() {
  return (
    <div className="relative rounded-[30px] shrink-0 w-full" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 350 239\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.5\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(11.348 26.327 -24.466 4.9171 61.523 10.27)\'><stop stop-color=\'rgba(46,167,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(37,97,153,0.35)\' offset=\'0.39029\'/><stop stop-color=\'rgba(33,62,102,0.275)\' offset=\'0.58543\'/><stop stop-color=\'rgba(28,27,51,0.2)\' offset=\'0.78057\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[30px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center p-[10px] relative w-full">
          <Chart2 />
        </div>
      </div>
    </div>
  );
}

function Content14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Content">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[17px] text-[rgba(255,255,255,0.6)] tracking-[-0.4px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`This week's energy use is 5% lower than last week - great job conserving!`}</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[44px] relative rounded-[30px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Button" style={{ backgroundImage: "linear-gradient(0.0777641deg, rgba(9, 15, 38, 0.7) 28.787%, rgba(2, 109, 255, 0.7) 67.826%, rgba(0, 215, 255, 0.7) 93.489%)" }}>
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[10px] relative size-full">
          <div className="absolute backdrop-blur-[10px] bg-[rgba(255,255,255,0.3)] h-[44px] left-0 mix-blend-overlay rounded-[20px] top-0 w-[350px]" data-name="Glass">
            <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
          </div>
          <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            View Detailed Report
          </p>
        </div>
      </div>
    </div>
  );
}

function EnergyConsumptionStatistics() {
  return (
    <div className="backdrop-blur-[10px] bg-gradient-to-b content-stretch flex flex-col from-[57.412%] from-[rgba(46,167,255,0)] gap-[20px] items-center p-[20px] relative rounded-[30px] shrink-0 to-[rgba(46,167,255,0.1)] w-[390px]" data-name="Energy Consumption Statistics">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[30px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1),0px_5px_10px_0px_rgba(0,0,0,0.1),0px_15px_30px_0px_rgba(0,0,0,0.15)]" />
      <Frame15 />
      <Frame32 />
      <Content14 />
      <Button2 />
    </div>
  );
}

function Contents4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[30px] items-start left-[20px] top-[120px]" data-name="Contents">
      <EnergyConsumptionTracker />
      <EnergyConsumptionStatistics />
    </div>
  );
}

function Time2() {
  return (
    <div className="-translate-y-1/2 absolute h-[54px] left-0 right-[64.25%] top-1/2" data-name="Time">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] inset-[33.96%_37.67%_25.3%_38.26%] leading-[22px] text-[17px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Battery2() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[33.33%] contents left-[calc(50%+24.8px)] top-[42.59%]" data-name="Battery">
      <div className="-translate-x-1/2 absolute border border-solid border-white bottom-[33.33%] left-[calc(50%+23.64px)] opacity-35 rounded-[4.3px] top-[42.59%] w-[25px]" data-name="Border" />
      <div className="-translate-x-1/2 absolute bottom-[41.01%] left-[calc(50%+37.8px)] top-[51.45%] w-[1.328px]" data-name="Cap">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.32804 4.07547">
          <path d={svgPaths.p193f1400} fill="var(--fill-0, white)" id="Cap" opacity="0.4" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-[37.04%] left-[calc(50%+23.64px)] rounded-[2.5px] top-[46.3%] w-[21px]" data-name="Capacity" />
    </div>
  );
}

function Levels2() {
  return (
    <div className="-translate-y-1/2 absolute h-[54px] left-[64.25%] right-0 top-1/2" data-name="Levels">
      <Battery2 />
      <div className="-translate-x-1/2 absolute bottom-[33.4%] left-[calc(50%-4.59px)] top-[43.77%] w-[17.142px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
          <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[33.77%] left-[calc(50%-30.26px)] top-[43.58%] w-[19.2px]" data-name="Cellular Connection">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
          <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, white)" fillRule="evenodd" id="Cellular Connection" />
        </svg>
      </div>
    </div>
  );
}

function StatusBar1() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="Status Bar">
      <Time2 />
      <Levels2 />
    </div>
  );
}

function ButtonCircle12() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[44px]" data-name="Button Circle">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div className="content-stretch flex items-center justify-center overflow-clip p-[6px] relative rounded-[inherit] size-full">
        <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.72px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          􀆉
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Leading1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center p-[6px] relative rounded-[32px] shrink-0 size-[44px]" data-name="Leading">
      <div aria-hidden="true" className="absolute backdrop-blur-[10px] bg-gradient-to-b from-[rgba(255,255,255,0.5)] inset-0 mix-blend-overlay pointer-events-none rounded-[32px] to-white" />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]" />
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.6)] text-center tracking-[-0.72px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        􀝖
      </p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-between px-[20px] relative shrink-0 w-[430px]">
      <ButtonCircle12 />
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[25px] relative shrink-0 text-[20px] text-center text-white tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Energy Usage Overview
      </p>
      <Leading1 />
    </div>
  );
}

function Divider8() {
  return <div className="h-px shrink-0 w-[430px]" data-name="Divider" />;
}

function NavigationBarIPhoneCompactSizeClass1() {
  return (
    <div className="backdrop-blur-[25px] content-stretch flex flex-col items-center relative shrink-0 w-[430px]" data-name="Navigation Bar - iPhone (Compact Size Class)">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.3)] border-b-[0.333px] border-solid inset-0 pointer-events-none" />
      <StatusBar1 />
      <Frame20 />
      <Divider8 />
    </div>
  );
}

function NavigationBar2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-px" data-name="Navigation Bar">
      <NavigationBarIPhoneCompactSizeClass1 />
    </div>
  );
}

function EnergyUsageOverview() {
  return (
    <div className="absolute bg-[#080b1c] h-[932px] left-[980px] overflow-clip rounded-[30px] shadow-[0px_30px_60px_0px_rgba(0,0,0,0.25)] top-0 w-[430px]" data-name="Energy Usage Overview">
      <BackgroundWeb1 />
      <Contents4 />
      <NavigationBar2 />
    </div>
  );
}

export default function Frame34() {
  return (
    <div className="relative size-full">
      <SmartHomeDashboard />
      <ThermostatController />
      <EnergyUsageOverview />
    </div>
  );
}