import TrendingImage from "../assets/image.png";

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

function MyCourse() {
  return (
    <section className="trending-section">
      <h2 className="trending-title">My courses</h2>
      <div className="trending-card">
        <div className="trending-content">
          <h3>Find courses to follow and start your own library.</h3>
          <button className="add-courses-btn">
            <PlusIcon />
            Add Courses
          </button>
        </div>

        <div className="trending-image-container">
          <img src={TrendingImage} alt="Trending courses illustration" />
        </div>
      </div>
    </section>
  );
}

export default MyCourse;
