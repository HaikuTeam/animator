import React from 'react'

export const EaseInOutQuartSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 224 46' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuartCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M112.012886,45.4223434 L224.025773,45.4223434 C191.921223,38.6964743 170.874563,32.2302544 160.885795,26.0236837 C145.906715,16.7163589 130.914404,0.586474331 112.020605,0.57770336 C112.020598,0.577642269 112.020592,0.577641076 112.020585,0.577699781 C112.018018,0.577699781 112.015452,0.577700079 112.012886,0.577700673 C112.010321,0.577700079 112.007754,0.577699781 112.005188,0.577699781 C112.005181,0.577641076 112.005174,0.577642269 112.005168,0.57770336 C93.1113693,0.586474331 78.1190574,16.7163589 63.1399783,26.0236837 C53.1512095,32.2302544 32.1045501,38.6964743 0,45.4223434 L112.012886,45.4223434 Z' id='Combined-Shape' fill={`url(#QuartCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInQuartSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 113 46' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuartCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,45.5136816 C32.1045501,38.7878126 53.1512095,32.3215927 63.1399783,26.1150219 C78.1231315,16.8051658 93.1195245,0.669038024 112.020585,0.669038024 C112.024044,0.639682381 112.025773,15.5878969 112.025773,45.5136816 L0,45.5136816 Z' id='Path-25' fill={`url(#QuartCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutQuartSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 112 45' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuartCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,44.8446867 C32.1045501,38.1188177 53.1512095,31.6525978 63.1399783,25.446027 C78.1231315,16.1361709 93.1195245,4.3152216e-05 112.020585,4.3152216e-05 C112.024044,-0.029312491 112.025773,14.918902 112.025773,44.8446867 L0,44.8446867 Z' id='Path-25-Copy-2' fill={`url(#QuartCurveGradient-1-${id})`} transform='translate(56.012886, 22.422343) scale(-1, 1) translate(-56.012886, -22.422343) ' />
    </g>
  </svg>
)

export const EaseInCircSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 234 45' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`CircCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,44.8339533 C81.5384077,38.4834576 136.473096,30.5484661 164.804064,21.0289787 C207.300516,6.74974766 213.454798,4.80046398e-16 233.905373,0 C233.9129,0.0459123856 233.916664,14.9905635 233.916664,44.8339533 L0,44.8339533 Z' id='Path-22' fill={`url(#CircCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInOutCircSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 468 45' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`CircCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,45 C81.5384077,38.6495044 136.473096,30.7145128 164.804064,21.1950254 C207.300516,6.91579437 213.454798,0.166046708 233.905373,0.166046708 C233.9129,0.211959094 233.916664,15.1566102 233.916664,45 L0,45 Z M467.916664,44.8339533 L234,44.8339533 C234,14.9905635 234.003764,0.0459123856 234.011291,0 C254.461866,4.80046398e-16 260.616148,6.74974766 303.1126,21.0289787 C331.443568,30.5484661 386.378256,38.4834576 467.916664,44.8339533 Z' id='Combined-Shape' fill={`url(#CircCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutCircSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 234 45' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`CircCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,44.8339533 C81.5384077,38.4834576 136.473096,30.5484661 164.804064,21.0289787 C207.300516,6.74974766 213.454798,4.80046398e-16 233.905373,0 C233.9129,0.0459123856 233.916664,14.9905635 233.916664,44.8339533 L0,44.8339533 Z' id='Path-22-Copy' fill={`url(#CircCurveGradient-1-${id})`} transform='translate(116.958332, 22.416977) scale(-1, 1) translate(-116.958332, -22.416977) ' />
    </g>
  </svg>
)

export const EaseInExpoSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 118 45' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`ExpoCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,45.0031528 C45.0582005,40.5334915 73.0251547,34.0033175 83.9008627,25.4126308 C100.214425,12.5266007 107.736537,4.46761101e-16 117.240369,0 C117.247097,0.0297664756 117.247097,15.0308174 117.240369,45.0031528 L0,45.0031528 Z' id='Path-23' fill={`url(#ExpoCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInOutExpoSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 234 45' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`ExpoCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M117.122707,45.0031528 L234.245415,45.0031528 C189.187214,40.5334915 161.22026,34.0033175 150.344552,25.4126308 C134.165942,12.6331985 126.63393,0.207273552 117.240502,0.00256476741 C117.240458,0.00105220632 117.240414,0.000197283852 117.240369,0 C117.201115,1.84527965e-18 117.161895,0.000213701175 117.122707,0.000640246192 C117.08352,0.000213701175 117.0443,1.84527965e-18 117.005046,0 C117.005001,0.000197283852 117.004957,0.00105220632 117.004913,0.00256476741 C107.611485,0.207273552 100.079473,12.6331985 83.9008627,25.4126308 C73.0251547,34.0033175 45.0582005,40.5334915 0,45.0031528 L117.122707,45.0031528 Z' id='Combined-Shape' fill={`url(#ExpoCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutExpoSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 117 45' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`ExpoCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,45.0031528 C45.0582005,40.5334915 73.0251547,34.0033175 83.9008627,25.4126308 C100.214425,12.5266007 107.736537,4.46761101e-16 117.240369,0 C117.247097,0.0297664756 117.247097,15.0308174 117.240369,45.0031528 L0,45.0031528 Z' id='Path-23-Copy-2' fill={`url(#ExpoCurveGradient-1-${id})`} transform='translate(58.622707, 22.501576) scale(-1, 1) translate(-58.622707, -22.501576) ' />
    </g>
  </svg>
)

export const EaseInQuintSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 110 46' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuintCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,45.2612049 C30.2002473,41.6011776 51.0872115,36.2823866 62.6608928,29.3048318 C80.0214148,18.8384996 85.1754845,14.0045818 91.4625155,8.70437211 C97.7495465,3.40416243 99.4150899,5.58658136e-06 109.988391,5.58658136e-06 C109.974455,-0.0105990896 109.967487,15.0764674 109.967487,45.2612049 L0,45.2612049 Z' id='Path-26' fill={`url(#QuintCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInOutQuintSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 220 47' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuintCurveGradient-1-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M219.988391,46.2612049 L110.020903,46.2612049 C110.020903,16.0764674 110.013935,0.98940091 110,1.00000559 C120.573301,1.00000559 122.238844,4.40416243 128.525875,9.70437211 C134.812906,15.0045818 139.966976,19.8384996 157.327498,30.3048318 C168.901179,37.2823866 189.788143,42.6011776 219.988391,46.2612049 Z M0,46 C30.2002473,42.3399727 51.0872115,37.0211816 62.6608928,30.0436268 C80.0214148,19.5772946 85.1754845,14.7433769 91.4625155,9.44316718 C97.7495465,4.1429575 99.4150899,0.738800653 109.988391,0.738800653 C109.974455,0.728195976 109.967487,15.8152624 109.967487,46 L0,46 Z' id='Combined-Shape' fill={`url(#QuintCurveGradient-1-${id})`} />
    </g>
  </svg>
)

export const EaseOutQuintSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 110 46' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuintCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,45.2612049 C30.2002473,41.6011776 51.0872115,36.2823866 62.6608928,29.3048318 C80.0214148,18.8384996 85.1754845,14.0045818 91.4625155,8.70437211 C97.7495465,3.40416243 99.4150899,5.58658136e-06 109.988391,5.58658136e-06 C109.974455,-0.0105990896 109.967487,15.0764674 109.967487,45.2612049 L0,45.2612049 Z' id='Path-26-Copy-3' fill={`url(#QuintCurveGradient-1-${id})`} transform='translate(54.994195, 22.630602) scale(-1, 1) translate(-54.994195, -22.630602) ' />
    </g>
  </svg>
)

export const EaseInCubicSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 222 42' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`CubicCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,41.1373263 C47.1698178,37.3947766 83.2901615,31.18806 108.361031,22.5171763 C145.967335,9.51085083 167.527371,1.23353881e-15 221.847442,0 C221.893083,0.00351083456 221.893083,13.7159529 221.847442,41.1373263 L0,41.1373263 Z' id='Path-21-Copy-2' fill={`url(#CubicCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInOutCubicSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 444 42' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`CubicCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M221.834277,1.86219731e-07 C167.523887,0.00153674584 145.964297,9.51190158 108.361031,22.5171763 C83.2901615,31.18806 47.1698178,37.3947766 0,41.1373263 L221.840861,41.1373263 L443.681721,41.1373263 C396.511903,37.3947766 360.39156,31.18806 335.32069,22.5171763 C297.714386,9.51085083 276.154351,1.23353881e-15 221.834279,0 Z' id='Combined-Shape' fill={`url(#CubicCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutCubicSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 222 42' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`CubicCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,41.1373263 C47.1698178,37.3947766 83.2901615,31.18806 108.361031,22.5171763 C145.967335,9.51085083 167.527371,1.23353881e-15 221.847442,0 C221.893083,0.00351083456 221.893083,13.7159529 221.847442,41.1373263 L0,41.1373263 Z' id='Path-21-Copy-3' fill={`url(#CubicCurveGradient-1-${id})`} transform='translate(110.940836, 20.568663) scale(-1, 1) translate(-110.940836, -20.568663) ' />
    </g>
  </svg>
)

export const EaseInOutQuadSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 221 38' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuadCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M110.033558,0.000153783439 C90.2312256,0.0512827488 60.3134437,15.1906316 34.429508,26.3648114 C25.7171611,30.12596 14.2406585,33.9977828 0,37.9802798 L110.083978,37.9802798 L220.167956,37.9802798 C205.927297,33.9977828 194.450795,30.12596 185.738448,26.3648114 C159.854512,15.1906316 129.93673,0.0512827488 110.134398,0.000153783439 C110.134272,1.08175335e-05 110.134145,-3.24663938e-05 110.134019,2.39316573e-05 C110.117346,2.39316573e-05 110.100665,3.46880177e-05 110.083978,5.61893065e-05 C110.06729,3.46880177e-05 110.05061,2.39316573e-05 110.033937,2.39316573e-05 C110.03381,-3.24663925e-05 110.033684,1.08175314e-05 110.033558,0.000153783429 Z' id='Combined-Shape' fill={`url(#QuadCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInQuadSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 111 38' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuadCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,37.9802798 C14.2406585,33.9977828 25.7171611,30.12596 34.429508,26.3648114 C60.3572529,15.171719 90.3325104,2.39316573e-05 110.134019,2.39316573e-05 C110.179268,-0.0200910123 110.179268,12.6399943 110.134019,37.9802798 L0,37.9802798 Z' id='Path-24' fill={`url(#QuadCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutQuadSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 111 38' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`QuadCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,37.9802798 C14.2406585,33.9977828 25.7171611,30.12596 34.429508,26.3648114 C60.3572529,15.171719 90.3325104,2.39316573e-05 110.134019,2.39316573e-05 C110.179268,-0.0200910123 110.179268,12.6399943 110.134019,37.9802798 L0,37.9802798 Z' id='Path-24-Copy-2' fill={`url(#QuadCurveGradient-1-${id})`} transform='translate(55.083978, 18.990140) scale(-1, 1) translate(-55.083978, -18.990140) ' />
    </g>
  </svg>
)

export const EaseInOutSineSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 227 36' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`SineCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M113.511027,35.7145242 L227.022055,35.7145242 C183.48513,11.9048414 145.649584,1.23823056e-15 113.515416,0 C113.513831,0.00172519568 113.512368,0.286350492 113.511027,0.853875889 C113.509687,0.286350492 113.508224,0.00172519568 113.506639,0 C81.3724709,1.23823056e-15 43.5369246,11.9048414 0,35.7145242 L113.511027,35.7145242 Z' id='Combined-Shape' fill={`url(#SineCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInSineSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 114 36' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`SineCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,35.7145242 C43.5369246,11.9048414 81.3724709,1.23823056e-15 113.506639,0 C113.516916,0.0111861203 113.522055,11.9160275 113.522055,35.7145242 L0,35.7145242 Z' id='Path-27' fill={`url(#SineCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutSineSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 114 36' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`SineCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,35.7145242 C43.5369246,11.9048414 81.3724709,1.23823056e-15 113.506639,0 C113.516916,0.0111861203 113.522055,11.9160275 113.522055,35.7145242 L0,35.7145242 Z' id='Path-27-Copy-2' fill={`url(#SineCurveGradient-1-${id})`} transform='translate(56.761027, 17.857262) scale(-1, 1) translate(-56.761027, -17.857262) ' />
    </g>
  </svg>
)

export const EaseOutBackSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='26px' viewBox='0 0 106 64' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`BackCurveGradient-3-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,43.9312098 C5.22747424e-16,49.6842866 5.22747424e-16,55.1132174 0,60.2180025 C0,62.8451175 0.525479949,63.9712813 3.94541408,63.3008469 C23.6039875,57.9102197 38.7129368,49.7963722 49.272262,38.9593046 C66.1549452,21.6325554 77.6529868,2.10504601e-15 105.966966,0 C106.00192,0.0571300864 105.973168,13.0230953 105.973168,38.8979153 C105.973168,43.2873248 105.39544,43.9312098 101.012427,43.9312098 C69.3042517,43.9312098 35.6334428,43.9312098 0,43.9312098 Z' id='Path-20-Copy-3' fill={`url(#BackCurveGradient-3-${id})`} transform='translate(52.992145, 31.745226) scale(-1, 1) translate(-52.992145, -31.745226) ' />
    </g>
  </svg>
)

export const EaseInOutBackSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='26px' viewBox='0 0 212 65' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`BackCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,43.9312098 C5.22747424e-16,49.6842866 5.22747424e-16,55.1132174 0,60.2180025 C0,62.8451175 0.525479949,63.9712813 3.94541408,63.3008469 C23.6039875,57.9102197 38.7129368,49.7963722 49.272262,38.9593046 C66.1549452,21.6325554 77.6529868,2.10504601e-15 105.966966,0 C106.00192,0.0571300864 105.973168,13.0230953 105.973168,38.8979153 C105.973168,40.4324201 105.973168,42.1101849 105.973168,43.9312098 C104.055747,43.9312098 102.402167,43.9312098 101.012427,43.9312098 C69.3042517,43.9312098 35.6334428,43.9312098 0,43.9312098 Z M211.98429,43.9312098 C176.350847,43.9312098 142.680038,43.9312098 110.971863,43.9312098 C109.582687,43.9312098 107.929107,43.9312098 106.011122,43.9312098 C106.011122,42.1107501 106.011122,40.4329852 106.011122,38.8979153 C106.011122,13.0230953 105.98237,0.0571300864 106.017324,0 C134.331303,2.10504601e-15 145.829345,21.6325554 162.712028,38.9593046 C173.271353,49.7963722 188.380302,57.9102197 208.038876,63.3008469 C211.45881,63.9712813 211.98429,62.8451175 211.98429,60.2180025 C211.98429,55.1132174 211.98429,49.6842866 211.98429,43.9312098 Z' id='Combined-Shape' fill={`url(#BackCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseInBackSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='26px' viewBox='0 0 106 64' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`BackCurveGradient-1-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,43.9312098 C5.22747424e-16,49.6842866 5.22747424e-16,55.1132174 0,60.2180025 C0,62.8451175 0.525479949,63.9712813 3.94541408,63.3008469 C23.6039875,57.9102197 38.7129368,49.7963722 49.272262,38.9593046 C66.1549452,21.6325554 77.6529868,2.10504601e-15 105.966966,0 C106.00192,0.0571300864 105.973168,13.0230953 105.973168,38.8979153 C105.973168,43.2873248 105.39544,43.9312098 101.012427,43.9312098 C69.3042517,43.9312098 35.6334428,43.9312098 0,43.9312098 Z' id='Path-20-Copy-2' fill={`url(#BackCurveGradient-1-${id})`} />
    </g>
  </svg>
)

export const EaseInElasticSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='27px' viewBox='0 0 222 170' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`ElasticCurveGradient-3-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,111.164803 C13.8522167,110.369512 23.3587807,109.893375 28.5196919,109.736392 C36.2610589,109.500918 60.03847,113.436423 64.5045597,113.441124 C68.9706495,113.445825 79.4338169,106.025115 86.6953588,106.070043 C93.9569007,106.114972 107.074729,117.001299 118.693371,117.001299 C130.312013,117.001299 132.417228,111.188913 133.109369,109.736392 C133.80151,108.283871 143.232842,75.3033776 152.950092,75.3033776 C162.667341,75.3033776 167.57645,105.49195 168.338206,109.736392 C169.099962,113.980834 172.980988,169.746279 185.65249,169.746279 C198.323992,169.746279 201.543129,117.123312 201.682306,111.164803 C201.821484,105.206295 202.735138,0.0853545359 221.840088,0 C221.846782,0.00794091991 221.846782,37.0628753 221.840088,111.164803 L0,111.164803 Z' id='Path-29-Copy' fill={`url(#ElasticCurveGradient-3-${id})`} />
    </g>
  </svg>
)

export const EaseInOutElasticSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='27px' viewBox='0 0 444 170' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`ElasticCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M221.80504,0.000274590879 C202.73402,0.213954443 201.821398,105.20994 201.682306,111.164803 C201.543129,117.123312 198.323992,169.746279 185.65249,169.746279 C172.980988,169.746279 169.099962,113.980834 168.338206,109.736392 C167.57645,105.49195 162.667341,75.3033776 152.950092,75.3033776 C143.232842,75.3033776 133.80151,108.283871 133.109369,109.736392 C132.417228,111.188913 130.312013,117.001299 118.693371,117.001299 C107.074729,117.001299 93.9569007,106.114972 86.6953588,106.070043 C79.4338169,106.025115 68.9706495,113.445825 64.5045597,113.441124 C60.03847,113.436423 36.2610589,109.500918 28.5196919,109.736392 C23.3587807,109.893375 13.8522167,110.369512 0,111.164803 L221.822579,111.164803 L443.645157,111.164803 C429.792941,110.369512 420.286377,109.893375 415.125465,109.736392 C407.384099,109.500918 383.606687,113.436423 379.140598,113.441124 C374.674508,113.445825 364.211341,106.025115 356.949799,106.070043 C349.688257,106.114972 336.570428,117.001299 324.951786,117.001299 C313.333144,117.001299 311.227929,111.188913 310.535788,109.736392 C309.843647,108.283871 300.412315,75.3033776 290.695065,75.3033776 C280.977816,75.3033776 276.068708,105.49195 275.306952,109.736392 C274.545195,113.980834 270.664169,169.746279 257.992668,169.746279 C245.321166,169.746279 242.102028,117.123312 241.962851,111.164803 C241.823759,105.20994 240.911137,0.213954443 221.840117,0.000274590879 C221.840108,0.000103189987 221.840098,1.16597092e-05 221.840088,0 C221.83425,2.60826492e-05 221.828413,6.19734382e-05 221.822579,0.00010766654 C221.816744,6.19734382e-05 221.810908,2.60826492e-05 221.80507,0 C221.80506,1.16597092e-05 221.80505,0.000103189986 221.80504,0.000274590832 Z' id='Combined-Shape' fill={`url(#ElasticCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutElasticSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='27px' viewBox='0 0 222 170' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`ElasticCurveGradient-1-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,111.164803 C13.8522167,110.369512 23.3587807,109.893375 28.5196919,109.736392 C36.2610589,109.500918 60.03847,113.436423 64.5045597,113.441124 C68.9706495,113.445825 79.4338169,106.025115 86.6953588,106.070043 C93.9569007,106.114972 107.074729,117.001299 118.693371,117.001299 C130.312013,117.001299 132.417228,111.188913 133.109369,109.736392 C133.80151,108.283871 143.232842,75.3033776 152.950092,75.3033776 C162.667341,75.3033776 167.57645,105.49195 168.338206,109.736392 C169.099962,113.980834 172.980988,169.746279 185.65249,169.746279 C198.323992,169.746279 201.543129,117.123312 201.682306,111.164803 C201.821484,105.206295 202.735138,0.0853545359 221.840088,0 C221.846782,0.00794091991 221.846782,37.0628753 221.840088,111.164803 L0,111.164803 Z' id='Path-29-Copy-2' fill={`url(#ElasticCurveGradient-1-${id})`} transform='translate(110.922554, 84.873140) scale(-1, 1) translate(-110.922554, -84.873140) ' />
    </g>
  </svg>
)

export const EaseInBounceSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='24px' viewBox='0 0 233 122' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`BounceCurveGradient-1-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,91.3427205 L0,85.2100913 C7.86757312,88.5881381 15.1629204,93.0975186 21.8860419,98.7382328 C21.9424136,98.7176695 21.9424136,90.5033573 21.8860419,74.0952962 C36.909274,84.5892936 50.8660531,94.9448436 63.756379,105.161946 C63.7865148,105.151665 63.8015827,88.5496706 63.8015827,55.3559645 C89.7765616,75.2587157 117.716178,97.2032565 147.620433,121.189587 C147.565834,121.165478 147.565834,80.7689494 147.620433,-1.8189894e-12 C181.18875,28.8880784 209.471947,59.3433362 232.470023,91.3657732 C232.470244,91.3523291 154.980237,91.3446449 0,91.3427205 Z' id='Path-28-Copy-2' fill={`url(#BounceCurveGradient-1-${id})`} />
    </g>
  </svg>
)

export const EaseInOutBounceSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='24px' viewBox='0 0 465 122' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`BounceCurveGradient-2-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M232.235011,91.0388546 C209.279357,59.1360404 181.074498,28.7897555 147.620433,-1.8189894e-12 C147.565834,80.7689494 147.565834,121.165478 147.620433,121.189587 C117.716178,97.2032565 89.7765616,75.2587157 63.8015827,55.3559645 C63.8015827,88.5496706 63.7865148,105.151665 63.756379,105.161946 C50.8660531,94.9448436 36.909274,84.5892936 21.8860419,74.0952962 C21.9424136,90.5033573 21.9424136,98.7176695 21.8860419,98.7382328 C15.1629204,93.0975186 7.86757312,88.5881381 0,85.2100913 L0,91.3427205 C148.020782,91.3445585 225.354541,91.3516506 232.001276,91.363997 C231.999993,91.3653458 232.07833,91.3649241 232.235011,91.3645083 C232.391692,91.3649241 232.47003,91.3653458 232.470023,91.3657732 C239.115482,91.3516506 316.44924,91.3445585 464.470023,91.3427205 L464.470023,85.2100913 C456.602449,88.5881381 449.307102,93.0975186 442.583981,98.7382328 C442.527609,98.7176695 442.527609,90.5033573 442.583981,74.0952962 C427.560748,84.5892936 413.603969,94.9448436 400.713643,105.161946 C400.683508,105.151665 400.66844,88.5496706 400.66844,55.3559645 C374.693461,75.2587157 346.753844,97.2032565 316.84959,121.189587 C316.904189,121.165478 316.904189,80.7689494 316.84959,-1.8189894e-12 C283.395525,28.7897555 255.190665,59.1360404 232.235011,91.0388546 Z' id='Combined-Shape' fill={`url(#BounceCurveGradient-2-${id})`} />
    </g>
  </svg>
)

export const EaseOutBounceSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='24px' viewBox='0 0 233 122' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`BounceCurveGradient-3-${id}`}>
        <stop stopColor={leftGradFill} offset='0%' />
        <stop stopColor={rightGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <path d='M0,91.3427205 L0,85.2100913 C7.86757312,88.5881381 15.1629204,93.0975186 21.8860419,98.7382328 C21.9424136,98.7176695 21.9424136,90.5033573 21.8860419,74.0952962 C36.909274,84.5892936 50.8660531,94.9448436 63.756379,105.161946 C63.7865148,105.151665 63.8015827,88.5496706 63.8015827,55.3559645 C89.7765616,75.2587157 117.716178,97.2032565 147.620433,121.189587 C147.565834,121.165478 147.565834,80.7689494 147.620433,-1.8189894e-12 C181.18875,28.8880784 209.471947,59.3433362 232.470023,91.3657732 C232.470244,91.3523291 154.980237,91.3446449 0,91.3427205 Z' id='Path-28-Copy' fill={`url(#BounceCurveGradient-3-${id})`} transform='translate(116.235011, 60.594794) scale(-1, 1) translate(-116.235011, -60.594794) ' />
    </g>
  </svg>
)

export const LinearSVG = ({leftGradFill, rightGradFill, id}) => (
  <svg width='100%' height='20px' viewBox='0 0 298 107' preserveAspectRatio='none'>
    <defs>
      <linearGradient x1='98.721091%' y1='100%' x2='0%' y2='100%' id={`LinearCurveGradient-1-${id}`}>
        <stop stopColor={rightGradFill} offset='0%' />
        <stop stopColor={leftGradFill} offset='100%' />
      </linearGradient>
    </defs>
    <g id='Timeline' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='0.429'>
      <rect id='Rectangle-50' fill={`url(#LinearCurveGradient-1-${id})`} x='0' y='0' width='298' height='107' />
    </g>
  </svg>
)
