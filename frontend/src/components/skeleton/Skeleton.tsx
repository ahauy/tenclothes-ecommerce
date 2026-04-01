import "./skeleton.css"

// kế thừa thuộc tính cơ bản của 1 thẻ div
type ISkeletonProps = React.HTMLAttributes<HTMLElement>

const Skeleton = ({className = '', ...rest}: ISkeletonProps) => {
  return (
    <div className={`skeleton ${className}`} {...rest}></div>
  )
};

export default Skeleton;