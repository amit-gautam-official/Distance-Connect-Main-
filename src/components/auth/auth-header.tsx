interface HeaderProps {
    label: string;
    title: string;
}

const AuthHeader = ({
    title,
    label
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col  items-center justify-center">
       {/* <h1 className="text-3xl font-semibold">{title}</h1> */}
       <img src="/logo.png" alt="Logo" className="w-1/2 h-auto " />
       <p className="text-muted-foreground text-sm">
        {label}
       </p>
    </div>
  )
}

export default AuthHeader;