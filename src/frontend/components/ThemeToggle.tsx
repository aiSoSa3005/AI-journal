import useDarkMode from '../hooks/useDarkMode';


export default function ThemeToggle() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
  
    return (
      <div onClick={toggleDarkMode} className='dark:text-white cursor-pointer border-2 text-center font-bold border-gray-400 w-[150px] p-2 rounded-full'>
            {isDarkMode ? " Light Mode" : "Dark Mode"}
      </div>
    );
  }