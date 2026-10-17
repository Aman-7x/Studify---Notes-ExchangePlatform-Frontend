import StudyBuddiesSVG from "../assets/study-buddies.svg"; // Import  SVG
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";

function SuperchargeCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <>
      <div className="supercharge-card">
        <div className="supercharge-text">
          {user ? (
            <div>
              <h2>Supercharge your studies!</h2>
              <p>
                Unlock <strong>exclusive features</strong> and stay ahead.
              </p>
              <button
                className="create-account-btn"
                style={{
                  color: "#ffffffff",
                  background:
                    "linear-gradient(45deg, rgba(30, 230, 23, 0.82) 0%, rgba(186, 201, 14, 1) 69%, rgba(30, 230, 23, 0.32) 100%)",
                }}
                onClick={() => navigate("/plans")}
              >
                Upgrade Now
              </button>
            </div>
          ) : (
            <div>
              <h2>Be a part of the learning revolution!</h2>
              <p>
                Sign up to enjoy <strong>exclusive access</strong> to top
                student resources.
              </p>
              <button
                className="create-account-btn"
                onClick={() => navigate("/signup")}
              >
                Create an account now
              </button>
            </div>
          )}
        </div>
        <div className="supercharge-image">
          <img src={StudyBuddiesSVG} alt="Study Buddies Illustration" />
        </div>
      </div>
    </>
  );
}

export default SuperchargeCard;
