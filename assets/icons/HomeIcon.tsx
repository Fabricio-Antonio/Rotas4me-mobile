import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const HomeIcon = (props: SvgProps) => (
  <Svg
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeWidth={2}
      d="M22.5 5.5c.332 0 .649.133.883.367l15.75 15.75a1.25 1.25 0 0 1-.884 2.133h-3.248v14.5a1.251 1.251 0 0 1-1.25 1.25h-4.5A1.252 1.252 0 0 1 28 38.25V31.5a3.252 3.252 0 0 0-3.25-3.25h-4.5A3.25 3.25 0 0 0 17 31.5v6.75a1.251 1.251 0 0 1-1.25 1.25h-4.5A1.252 1.252 0 0 1 10 38.25v-14.5H6.75a1.252 1.252 0 0 1-1.226-1.494 1.25 1.25 0 0 1 .342-.64l15.75-15.75A1.25 1.25 0 0 1 22.5 5.5Z"
    />
  </Svg>
)
export default HomeIcon
