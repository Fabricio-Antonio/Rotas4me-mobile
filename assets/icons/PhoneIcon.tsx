import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const PhoneIcon = (props: SvgProps) => (
  <Svg
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#33363F"}
      fill={props.fill || "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.878 5.322A2.5 2.5 0 0 0 9.557 3.75H6.118A2.368 2.368 0 0 0 3.75 6.118c0 11.118 9.014 20.132 20.132 20.132a2.368 2.368 0 0 0 2.368-2.369v-3.439a2.5 2.5 0 0 0-1.57-2.32l-3.296-1.318a2.5 2.5 0 0 0-2.53.4l-.85.71a2.501 2.501 0 0 1-3.369-.153l-2.395-2.397a2.5 2.5 0 0 1-.154-3.368l.71-.85a2.5 2.5 0 0 0 .401-2.53l-1.319-3.294Z"
    />
  </Svg>
)
export default PhoneIcon
