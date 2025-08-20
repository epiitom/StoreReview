const Card = ({ children, className = "", hover = false }) => {
  return (
    <div
      className={`
            bg-white rounded-md shadow-sm border border-gray-200 p-13
            ${hover ? "hover:shadow-md transition-shadow duration-200" : ""}
            ${className}
        `}
    >
      {children}
    </div>
  )
}

export default Card
