import SuperchargeCard from "./SuperchargeCard";

function WelcomeSection(){
 
    return <>
    <div className="welcome-container">
        <h1 className="welcome-title">
             Welcome to Studify 🙌
        </h1>
         <p className="welcome-subtitle">
        This is your home, the starting point to discover the best study material.
      </p>
      < SuperchargeCard/>
    </div>
    </>
}

export default WelcomeSection;