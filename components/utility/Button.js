import PropTypes from "prop-types";
import Image from "next/image";

function ButtonComponent({
  children,
  loading = false,
  onClick,
  type = "button",
  icon,
  id,
  className = "",
  rounded = false,
  color = "primary",
  full = false,
  align = "center",
  padding = "normal",
  border = true,
  disabled = false,
  onlyIcon = false,
}) {
  const colorMap = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-black border border-black",
    light: "bg-lightprimary text-black",
  };
  const alignMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  const paddingMap = {
    normal: "py-2 px-5",
    no: "p-0",
    small: "py-1.5 px-3",
  };
  const loadingMap = {
    normal: "h-4 w-4",
    no: "h-3 w-3",
    small: "h-4 w-4",
  };

  const onAction = () => {
    if (disabled || loading) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      id={id}
      type={type}
      className={`flex items-center hover:bg-opacity-90 duration-150 ease-in-out relative overflow-hidden my-1 text-sm font-normal min-w-fit
        ${rounded ? "rounded-full" : ""}
        ${full ? "w-full" : ""}
        ${border ? "border border-black" : ""}
        ${colorMap[color]}
        ${paddingMap[padding]}
        ${disabled ? "opacity-70 pointer-events-none" : ""}
        ${onlyIcon ? "rounded-xl h-8 w-9 ml-3" : ""}
        ${loading ? "!opacity-50 !pointer-events-none" : ""},
        ${className} ${alignMap[align]}`}
      onClick={onAction}
    >
      {loading ? (
        <div
          class={`${colorMap[color]} rounded-full w-full absolute z-10 top-0 right-0 left-0 bottom-0 flex justify-center items-center`}
        >
          <svg
            class={`${loadingMap[padding]} animate-spin`}
            viewBox="3 3 18 18"
          >
            <path
              class="fill-sky-100"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            ></path>
            <path
              style={{ fill: "#2EAAED" }}
              d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
            ></path>
          </svg>
        </div>
      ) : (
        ""
      )}
      {icon}
      {children}
    </button>
  );
}

ButtonComponent.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  color: PropTypes.string,
  full: PropTypes.bool,
};

export default ButtonComponent;
