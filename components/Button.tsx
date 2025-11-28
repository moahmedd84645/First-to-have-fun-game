import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-3xl font-black shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[6px] transition-all duration-150 flex items-center justify-center";
  
  const variants = {
    // Changed text-white to text-kid-navy for better visibility on orange/yellow
    primary: "bg-kid-orange text-kid-navy border-2 border-transparent hover:bg-yellow-400 hover:border-white",
    secondary: "bg-white text-kid-navy border-4 border-kid-blue hover:bg-gray-50",
    danger: "bg-red-400 text-white border-2 border-red-500 hover:bg-red-500",
    success: "bg-kid-green text-kid-navy border-2 border-green-400 hover:bg-green-300",
  };

  const sizes = {
    md: "px-6 py-3 text-lg",
    lg: "px-10 py-5 text-2xl w-full sm:w-auto",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};