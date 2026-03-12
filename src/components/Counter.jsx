import '../assets/styles/Counter.css';

export default function Counter({ theme, count }) {
    return (
        <div className={`counter ${theme}`}>
            {count}
        </div>
    )
}