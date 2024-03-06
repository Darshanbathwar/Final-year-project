import React,{useState, useEffect} from 'react';
import Header from '../Components/Header';
import Card from '../Components/Card';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import CreateEvent from './CreateEvent';
import { getStorage, listAll, getDownloadURL,ref } from 'firebase/storage';
import { collection, getFirestore, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../txtImgConfig';

function Dashboard({ cards }) {
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const cardsRef = collection(db, 'cards');
      const snapshot = await getDocs(cardsRef);
      const cards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCardsData(cards);
    };

    const fetchImages = async () => {
      const imagesListRef = ref(storage, 'images'); // Replace with your storage path
      try {
        const response = await listAll(imagesListRef);
        const urls = await Promise.all(response.items.map((item) => getDownloadURL(item)));
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchCards();
    fetchImages();
  }, []);

  const handleCardClick = (card) => {
    // Navigate to the CreateEvent page with predefined data
    const documentId = card.id;
    navigate(`/CreateEvent/${card.id}`, { state: card, documentId });
  };

  const handleCardDelete = async (cardId) => {
    // ... (implementation for deleting a card)
  };

  return (
    <>
      <div className='dashboard bg-zinc-900 h-screen'>
        <Header />
        <div className='card-container grid grid-cols-1 gap-8 p-5 md:grid-cols-2 xl:grid-cols-3 xl:px-20 pt-14'>
          {cardsData.map((cardData, index) => {
            const matchingImageUrl = imageUrls.find((url) => url.includes(cardData.imageUrl)); // Find matching image URL

            const displayImage = matchingImageUrl || 'https://via.placeholder.com/200?text=Image+Not+Found'; // Use placeholder if not found

            return (
              <Card
                key={index}
                Slogan={cardData.Slogan}
                desc={cardData.description}
                imageUrl={displayImage}
                {...cardData}
                onClick={() => handleCardClick(cardData)}
                onDelete={() => handleCardDelete(cardData.id)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
// function Dashboard({cards}) {
//   // const {cardsData, startEditingEvent} = useAppContext();
//   const [cardsData, setCardsData] = useState([]);
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [editingCard, setEditingCard] = useState(null);
//   const [imageUrls, setImageUrls] = useState([]);
//   const navigate = useNavigate();
//   const db = getFirestore();
//   const storage = getStorage();

//   useEffect(() => {
//     const db = getFirestore(); // Directly get the Firestore instance
//     const cardsRef = collection(db, 'cards'); // Get a reference to the collection
  
//     const fetchCards = async () => {
//       const snapshot = await getDocs(cardsRef);
//       const cards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setCardsData(cards);
//     };
  
//     fetchCards();

//     const fetchImages = async () => {
//       const imagesListRef = ref(storage, 'images'); // Replace 'images' with your storage path
//       try {
//         const response = await listAll(imagesListRef);
//         const urls = await Promise.all(response.items.map((item) => getDownloadURL(item)));
//         setImageUrls(urls);
//       } catch (error) {
//         console.error('Error fetching image URLs:', error);
//       }
//     };

//     fetchImages();
//   }, []);

//   const handleCardClick = (card) => {
//     // Navigate to the CreateEvent page with predefined data
//     const documentId = card.id;
//     navigate(`/CreateEvent/${card.id}`, { state: card, documentId });
//   };

//   // const handleEdit = (id) => {
//   //   const cardToEdit = cardsData.find((card) => card.id === id);
//   //   setSelectedCard(cardToEdit);
//   // };

//   // const redirectToEventsPage = () => {
//   //   // Perform redirection logic here
//   //   // For example, you can use window.location or any routing library you're using
//   //   window.location.href = '/'; // Replace with the actual path of your events page
//   // };
//   const handleCardDelete = async (cardId) => {
//     // Add logic to delete the card from Firebase
//     const db = getFirestore();
//     const cardsRef = collection(db, 'cards');

//     try {
//       await deleteDoc(doc(cardsRef, cardId));
//       // Update state to remove the deleted card
//       setCardsData((prevCards) => prevCards.filter((card) => card.id !== cardId));
//     } catch (error) {
//       console.error('Error deleting card:', error);
//     }
//   };

//     return (
//       <>
//         <div className='dashboard'>
//           <Header/>
//           <div className='card-container'>
//             {cardsData.map((cardData, index) => (
//               <Card 
//               key={index} 
//               Slogan={cardData.Slogan}   
//               desc={cardData.description} 
//               imageUrl={cardData.imageUrl}      
//               {...cardData} 
//               onClick={() => handleCardClick(cardData)}
//               onDelete={() => handleCardDelete(cardData.id)}/>
//             ))}
//           </div>
//       </div>
//       </>
//     );
// }

export default Dashboard;