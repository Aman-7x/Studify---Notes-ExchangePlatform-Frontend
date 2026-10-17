// import './Search.css'
function Search({ value, onChange, onSubmit })  {
    const handleSubmit = (e) => {
    e.preventDefault();   
    if (onSubmit) {
      onSubmit();  
    }
  };
  return (
    <>
     <form className="search-container" onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-input-big"
        placeholder="Search for documents, courses or studylists"
        value={value}  
        onChange={(e) => onChange(e.target.value)}  
      />
      <button type="button"  hidden>
        <svg className="search-icon-big" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </button>
    </form>
    </>
  );
}

export default Search;