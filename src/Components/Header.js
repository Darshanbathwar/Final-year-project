import React,{useState,useEffect} from "react";
import './Header.css'
import { FaPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { collection, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../txtImgConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";


function Header(){
  let [currentUser, setCurrentUser] = useState('');
  const [documentCount, setDocumentCount] = useState(0);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const auth = getAuth(); // Replace with your authentication provider's instance
  currentUser = auth.currentUser;
  useEffect(() => {
    const fetchDocumentCount = async () => {
      const db = getFirestore();
      const collectionRef = collection(db, "cards"); // Replace with your actual collection name

      try {
        const querySnapshot = await getDocs(collectionRef);
        const count = querySnapshot.size; // Get the number of documents in the collection
        setDocumentCount(count);
        if (currentUser) {
          const docRef = doc(getFirestore(), "users", currentUser.uid); // Replace with your user data collection name
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          }
        }
      } catch (error) {
        console.error('Error fetching document count:', error);
      }
    };

    

    fetchDocumentCount();
  }, []); // Run this effect only once on component mount

  const handleUserInfoClick = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
  };

  const logout = () =>{
    localStorage.clear();
    window.location.href = '/';
  }
    return(
        <>
            <div className="header">
                <div className="events">
                    <h2>Events</h2>
                    <div className="counter">
                        <p>{documentCount}</p>
                    </div>
                </div>
                <div className="right-part">
                  <div className="add-button">
                      <NavLink to={'/CreateEvent'}>
                          <button>
                              <FaPlus />
                              <p>Add Event</p>
                          </button>
                      </NavLink>
                  </div>
                  <div className="user-section" onClick={handleUserInfoClick}>
                    {currentUser ? (
                      <>
                        <div className="user-info">
                          <div className="username"><p>{currentUser.displayName}</p></div>
                          <img src={currentUser.photoURL} alt={currentUser.name} className="user-img" />
                        </div>
                      </>
                    ) : (
                      <>
                        <img src="/default-user-image.png" alt="Default User" className="user-img" />
                        <div className="username"><p>User Name Unavailable</p></div>
                      </>
                    )}
                   {isUserInfoOpen && (
                      <div className="user-dropdown">
                        {/* Add logout button and other options you want in the dropdown */}
                        <button className="logout-btn" onClick={logout}>Logout</button>
                      </div>
                    )}
                  </div>
                </div>
            </div>
        </>
    );
}
export default Header;