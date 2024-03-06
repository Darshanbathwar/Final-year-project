import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cardsData, setCardsData] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const addCard = (cardData) => {
    setCardsData((prevCardsData) => [...prevCardsData, cardData]);
  };

  // const editCard = (editedCardData) => {
  //   setCardsData((prevCardsData) => {
  //     const updatedCards = prevCardsData.map((card) =>
  //       card.id === editingEvent.id ? { ...card, ...editedCardData } : card
  //     );
  //     setEditingEvent(null); // Reset editingEvent after editing
  //     return updatedCards;
  //   });
  // };

  // const startEditingEvent = (eventToEdit) => {
  //   setEditingEvent(eventToEdit);
  // };

  const editCard = (updatedCard) => {
    // Find the index of the card to update
    const index = cardsData.findIndex((card) => card.id === updatedCard.id);

    if (index !== -1) {
      // Replace the existing card with the updated one
      setCardsData((prevCards) => [
        ...prevCards.slice(0, index),
        updatedCard,
        ...prevCards.slice(index + 1),
      ]);
    }
  };

  const updateCardsData = (newCardsData) => {
    setCardsData(newCardsData); // Update the cards data directly
  };

  const startEditingEvent = (card) => {
    // You might set a state variable or dispatch an action to indicate editing mode
    console.log('Starting to edit card:', card);
  };

  const contextValue = {
    cardsData,
    addCard,
    editCard,
    startEditingEvent,
    updateCardsData,
  };  

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
