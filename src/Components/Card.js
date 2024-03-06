import React from "react";
import './Card.css';
import { MdDelete } from "react-icons/md";

function Card({ Image, Committee, Slogan, desc, author, date, imageUrl, onClick, onDelete }) {
    const handleEdit = () => {
      // You can directly use handleEdit here
      // console.log("Editing card with date:", date);
      // Add logic to perform the edit action
    };
  
    const handleDelete = (e) => {
      e.stopPropagation(); // Prevent the card click event from firing
      // Call the onDelete prop to delete the card
      onDelete();
    };
  
    return (
      <>
        <div className="transition-all duration-500 ease-in-out border border-solid shadow-md border-eee rounded-2xl hover: hover:shadow-lg hover:-translate-y-4">
    
        <img src={Image} className="rounded-2xl max-h-[300px] object-cover w-full border border-solid border-e"/>
        <p className="category bg-green  text-lg w-fit px-2 text-center text-eee rounded-2xl py-[2px] mb-5 mt-1 font-[700] cursor-pointer ease-in duration-100 hover:scale-110"
        >{Committee}</p><br />
        <a className="title font-[450] font-roboto text-sm lg:text-lg xl:text-xl text-l-black 2xl:text-2xl 2xl:pt-4">{Slogan}</a><br />
        <a className="desc line-clamp-[5] xl:pr-10 pt-3 2xl:pr-[40px]  text-[#6a6969] line text-sm xl:text-normal">{desc}</a><br />
        <a className="author">{author}</a><br />
        <a className="date">{date}</a><br />
      </div>
      </>
    );
  }
  

export default Card;