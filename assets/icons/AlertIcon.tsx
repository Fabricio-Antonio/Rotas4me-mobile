import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const AlertIcon = (props: SvgProps) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 35 35"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#33363F"}
      fill={props.fill || "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.5 12.323v5.834m0 12.468c-7.249 0-13.125-5.876-13.125-13.125S10.251 4.375 17.5 4.375 30.625 10.251 30.625 17.5 24.749 30.625 17.5 30.625Zm.073-8.093v.145h-.146v-.145h.146Z"
    />
  </Svg>
)
export default AlertIcon
