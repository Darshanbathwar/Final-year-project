import React, { useState, useRef, useEffect } from 'react';
import './CreateEvent.css';
import upload from '../assets/images/image_upload.png';
import { useAppContext } from '../AppContext';
import { useParams,useNavigate, useLocation } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { collection, getFirestore,doc, addDoc, updateDoc, update, Firestore, setDoc, getDocs,getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../txtImgConfig';


function CreateEvent({ cards, onCardCreate, onSave, selectedCard }) {
    const { addCard,editCard, updateCardsData } = useAppContext();
    const db = getFirestore();
    const contextValues = useAppContext();
    // const {addCard} = contextValues;
    // const {updateCardsData} = contextValues;
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

  const [formData, setFormData] = useState({
    Slogan: '',
    date: '',
    description: '',
    Committee: '',
    // Image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const uploadImage = () => {
    const storage = getStorage();
    if(imageUpload == null) return;
    const imagRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imagRef,imageUpload).then(()=>{
      alert("Image Uploaded");
    })
  };


        useEffect(() => {
            const { state } = location;
            if (state) {
            setFormData(state);
            }
            if (id) {
              const selectedCard = cards.find((card) => card.id === parseInt(id, 10));
              if (selectedCard) {
                setFormData({
                  Slogan: selectedCard.Slogan || '',
                  date: selectedCard.date || '',
                  description: selectedCard.description || '',
                  Committee: selectedCard.Committee || '',
                  Image: selectedCard.Image || '',
                });
              }
            }
        }, [location,id,cards]);

    
    
        const handleChange = (e) => {
          const { name, value } = e.target;
        
          // Update the state based on the input name
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        };
        
        const handleImageChange = (e) => {
          const file = e.target.files[0];
          setImageFile(file);
        };

        const handleChangeImage = (e) => {
          const file = e.target.files[0];
          console.log(file)
          setFormData((prevData) => ({ ...prevData, Image: file }));
        };

        const handleUpload = async () => {
          const storage = getStorage();
          const storageRef = ref(storage, `images/${Date.now()}_${formData.Image.name}`);
          await uploadBytes(storageRef, formData.Image);
          const imageURL = await getDownloadURL(storageRef);
          console.log('Image uploaded:', imageURL);
        };
      // const handleSave = async () => {
      //   try {
      //     const db = getFirestore();
      //     const cardsCollectionRef = db.collection('cards');
      
      //     if (id) {
      //       const cardsRef = db.collection('cards').doc(id); // CollectionReference
      //       // const docRef = cardsRef.doc(db, 'cards', id); // Get DocumentReference for update
      //       const updatedCard = { ...formData };
      //       console.log(updatedCard); // Log updatedCard before update
      //       await cardsRef.update(updatedCard); // Use docRef for update
      //       updateCardsData([
      //         ...contextValues.cardsData.filter((card) => card.id !== id),
      //         updatedCard,
      //       ]);
      //     } else {
      //       const newCardData = { ...formData };
      //       await addDoc(cardsCollectionRef, newCardData); // Add new card to collection
      //     }
      
      //     navigate('/'); // Redirect to Dashboard
      //   } catch (error) {
      //     console.error('Error saving card:', error);
      //     // Provide user-friendly error feedback or try alternative actions
      //   }
      // };
      const createCardNew = async () => {
        try {
          const db = getFirestore();
          const cardsCollectionRef = collection(db, 'cards');
      
          const newCardData = { ...formData };
      
          // Add the new card to the collection
          const docRef = await addDoc(cardsCollectionRef, newCardData);
      
          // Update the local state with the newly created card
          updateCardsData([...contextValues.cardsData, { id: docRef.id, ...newCardData }]);
      
          // Redirect to Dashboard
          navigate('/');
        } catch (error) {
          console.error('Error creating card:', error);
          // Provide user-friendly error feedback
        }
      };

      const handleSaveImage = async () => {
        const db = getFirestore();
        const storage = getStorage();
        const cardsCollectionRef = collection(db, "cards");
        const updatedCard = { ...formData, id: parseInt(id, 10) };
        // For updating existing cards, assume images are already stored
        if (id) {
          const docRef = doc(db, "cards", id);
          await docRef.update(updatedCard);
        } else {
          // Handle image upload for new cards
          const newCardData = { ...formData };
          try {
            const imageRef = ref(storage, "cardImages"); // Reference to Firebase Storage
            const uploadTask = await uploadBytesResumable(imageRef, formData.image); // Upload image
      
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref); // Get image URL
            newCardData.imageUrl = imageUrl; // Add image URL to card data
      
            await addDoc(collection(db, "cards"), newCardData); // Create card with image URL
          } catch (error) {
            console.error("Error uploading image:", error);
            // Handle error gracefully, e.g., inform user and retry
          }
        }
      
        navigate('/'); // Redirect to the Dashboard
      };
      
      const handleSaveImage2 = async () => {
        try {
          const db = getFirestore();
          const storage = getStorage();
          const cardsCollectionRef = collection(db, "cards");
      
          // Create a new card data object
          const newCardData = { ...formData };
      
          // Upload the image to Firebase Storage (if an image is provided)
          if (formData.Image) {
            // Call the handleUpload function to upload the image
            const imageURL = await handleUpload(storage, formData.Image);
      
            // Add the imageURL to the new card data
            newCardData.Image = imageURL;
          }
      
          // If editing an existing card, update the document
          if (id) {
            const docRef = doc(db, "cards", id);
            await updateDoc(docRef, newCardData);
          } else {
            // If creating a new card, add a new document
            await addDoc(cardsCollectionRef, newCardData);
          }
      
          // Redirect to the Dashboard
          navigate('/');
        } catch (error) {
          console.error('Error saving card:', error);
          // Provide user-friendly error feedback
        }
      };
      
      const handleSaveImage3 = async () => {
        try {
          const db = getFirestore();
          const storage = getStorage();
          const cardsCollectionRef = collection(db, 'cards');
      
          // Create a new card data object
          const newCardData = { ...formData };
      
          // Upload the image to Firebase Storage (if an image is provided)
          if (formData.Image) {
            const imageRef = ref(storage, `images/${Date.now()}_${formData.Image.name}`);
            await uploadBytes(imageRef, formData.Image);
            const imageURL = await getDownloadURL(imageRef);
      
            // Add the imageURL to the new card data
            newCardData.Image = imageURL;
          }
      
          // If editing an existing card, update the document
          if (id) {
            const docRef = doc(db, 'cards', id);
            await updateDoc(docRef, newCardData);
          } else {
            // If creating a new card, add a new document
            await addDoc(cardsCollectionRef, newCardData);
          }
      
          // Redirect to the Dashboard
          navigate('/');
        } catch (error) {
          console.error('Error saving card:', error);
          // Provide user-friendly error feedback
        }
      };
      
      

      const handleSaveOld = async() => {
        const db = getFirestore();
        const cardsCollectionRef = collection(db, "cards");
        const updatedCard = { ...formData, id: parseInt(id, 10) };
        const newCardData = { ...formData};
        if (id) {
          const docRef = doc(db, "cards", id);
          await docRef.update(updatedCard);
        } else {
          await addDoc(collection(db, "cards"), newCardData);
        }
      
        navigate('/dashboard'); // Redirect to the Dashboard
      };

      const handleSave = async () => {
        try {
          const db = getFirestore();
          const cardsCollectionRef = collection(db, 'cards');
          let imageURL = formData.Image;
    
          if (imageFile) {
            // If a new image is selected, upload it to Firebase Storage
            const storage = getStorage();
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageURL = await getDownloadURL(storageRef);
          }
    
          const cardData = {
            Slogan: formData.Slogan,
            date: formData.date,
            description: formData.description,
            Committee: formData.Committee,
            Image: imageURL,
          };
    
          if (id) {
            // If editing an existing card
            const cardRef = doc(db, 'cards', id);
            await setDoc(cardRef, cardData);
          } else {
            // If creating a new card
            const newCardRef = await addDoc(cardsCollectionRef, cardData);
            id = newCardRef.id; // Set id to the newly created document's id
          }
    
          onCardCreate(cardData);
    
          // Redirect to Dashboard
          navigate('/');
        } catch (error) {
          console.error('Error saving card:', error);
        }
      };
      

      // const handleSave = async () => {
      //   try {
      //     const updatedCard = { ...formData };
      //     const db = getFirestore();
      //     const docRef = doc(db, 'cards', id); // Get DocumentReference
      //     await updateDoc(docRef, updatedCard); // Use updateDoc for newer versions
      //   } catch (error) {
      //     console.error('Error saving card:', error);
      //     // Handle error appropriately
      //   }
      // };
      
      const updateDocument = async () => {
        try {
          const documentId = id;
          const updatedData = { ...formData}
          const db = getFirestore();
          const documentRef = doc(db, "cards", documentId); // Replace 'your-collection' with your actual collection name
          await updateDoc(documentRef, updatedData);
          console.log(`Document with ID ${documentId} updated successfully.`);
        } catch (error) {
          console.error('Error updating document:', error);
        }
        navigate('/dashboard');
      };
      
      
      const updateDocumentById = async () => {
        const db = getFirestore();
        const collectionRef = collection(db, "cards");
        const newData = {Committee: "Techshala"}
        const updatedData = { ...formData}
        try {
          const querySnapshot = await getDocs(collectionRef);
      
          querySnapshot.forEach(async (docSnapshot) => {
            const documentId = docSnapshot.id;
            const data = docSnapshot.data();
            console.log(data);
            // Check if 'id' exists in the document and has the specified value
            if (data.hasOwnProperty('id') && data.id === id) {
              const documentRef = doc(collectionRef, documentId);
              try {
                // Update the document with new data
                await updateDoc(documentRef, updatedData);
                console.log(`Document with ID ${documentId} updated successfully.`);
              } catch (error) {
                console.error('Error updating document:', error);
              }
            }
          });
          navigate('/');
        } catch (error) {
          console.error('Error getting documents:', error);
        }
      };
    //   const handleSaveButtonClick = () => {
    //     // Gather the form data and create an updated card object
    //     const updatedCard = {
    //       ...card,
    //       ...formData,
    //     };
    
        // Call the onSave prop to update the card in the Dashboard component
    //     onSave(updatedCard);
    
    //     // Clear the selected card to switch back to the Dashboard view
    //     clearSelectedCard();
    //     // Redirect to the events page
    //     redirectToEventsPage();
    //   };

      const redirectToEventsPage = () => {
        // Perform redirection logic here
        // For example, you can use window.location or any routing library you're using
        window.location.href = '/'; // Replace with the actual path of your events page
      };

    //   const handleSave = () => {
    //     // Save the updated card data
    //     const updatedCard = {
    //       id: parseInt(id, 10),
    //       title: formData.title,
    //       // Other form fields...
    //     };
    //     // Call the onCardCreate prop to update the card in the Dashboard component
    //     onCardCreate(updatedCard);
    //     addCard(updatedCard);
    
    //     // Navigate back to the Dashboard after saving
    //     navigate('/');
    //   };

    const handleSubmit = (e) => {
      
        e.preventDefault();
        const newCardData = { ...formData };
        addCard(newCardData);
        setFormData({
          Slogan: '',
          date: '',
          description: '',
          author: '',
          Committee: '',
        });
      };
    
      const createCard = ({ Slogan, date, description, author, Committee,Image }) => {
        // Use the form data to create a new card
        // For now, I'll just log it, but you can replace this with your logic
        console.log('Creating Card:', { Slogan, date, description, author, Committee,Image });
      };
    
    
    return(
        <>
            <div className='create-event'>
                <div className='create-header'>
                        <div className='header-text'>
                            <input className='title' 
                            type='text' 
                            name='Slogan' 
                            value={formData.Slogan} 
                            placeholder='Untitled' 
                            onChange={handleChange}/>
                            <div className='underline'></div>
                        </div>
                        <div className='button-row'>
                                <button onClick={updateDocument}>Save</button>
                                <button>Cancel</button>
                                <button onClick={handleSaveImage3}>Submit</button>
                        </div>
                </div>
                <div className='event-form'>
                    <div className='img-box'>
                        <div className='text-box'><p>Images</p></div>
                        <div className='image-drop'>
                            <div className='img-outer-container'>
                                <label htmlFor='fileInput'>
                                    <img src={upload} width={50} alt='File Upload' name='Image' value={formData.Image}/>
                                </label>
                                <input 
                                type='file' 
                                id='fileInput' 
                                style={{ display: 'none', backgroundColor: '#e0e0e0' }} 
                                onChange={handleChangeImage}/>
                            </div>
                        </div>
                    </div>
                    <div className='img-box' id='event-input'>
                        <div className='text-box'><p>Event Info</p></div>
                        <div className='event-info-container'>
                            <div className='text-container' id='date-container'>
                                <label htmlFor='date-box'>Date:</label>
                                <input className='info-box' id='date-box' name='date' value={formData.date} type='text' onChange={handleChange}/>
                            </div>
                            <div className='text-container' >
                                <label htmlFor='date-box'>Committee:</label>
                                <input className='info-box' id='date-box' name='Committee' value={formData.Committee} type='text' onChange={handleChange}/>
                            </div>
                            <div className='text-container'>
                                <label htmlFor='date-box'>Description:</label>
                                <textarea className='info-box' id='desc-box' name='description' value={formData.description} onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateEvent;

//