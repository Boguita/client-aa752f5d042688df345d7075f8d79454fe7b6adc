import '../css/auth.css';

const Input = ({ label, type, placeholder, name, value, onChange, className, disabled, min }) => {
  return (
    <form className="form-horizontal">
    <div className="form-group relative">
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#006084]"></div>
                            <input 
                                required
                                type={type}
                                placeholder={placeholder}
                                name={name}
                                disabled={disabled}
                                onChange={onChange}
                                value={value}
                                label={label}
                                className={`${className} p-2 bg-gray-200 focus:outline-none font-semibold text-gray-800`}
                                min={min}
                            />
                        </div>
     </form>
    );

  }
  

export default Input;