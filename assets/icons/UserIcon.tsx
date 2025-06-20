import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const UserIcon = (props: SvgProps) => (
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
      d="M19.688 7.5a4.688 4.688 0 1 1-9.376 0 4.688 4.688 0 0 1 9.376 0ZM5.626 25.148a9.375 9.375 0 0 1 18.748 0A22.415 22.415 0 0 1 15 27.188c-3.345 0-6.52-.73-9.374-2.04Z"
    />
  </Svg>
)
export default UserIcon
