import { useState, useEffect, useMemo } from "react";
import "../cards/cards.scss";
import { FaBookmark, FaRegBookmark, FaCalendarCheck } from "react-icons/fa";
import { FaCalendarXmark } from "react-icons/fa6";
import { LuSearchX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteTender, fetchTenders, setTenderToEdit, showCreateTenderForm } from "../../features/tendersSlice";
import { fetchAllUsers, toggleBookmark } from '../../features/usersSlice.js'
import { RiMoneyEuroBoxFill} from "react-icons/ri";
import { MdLocationCity } from "react-icons/md";
import NotResult from "../notResult/NotResult.jsx";
import Confirm from "../confirm/confirm.jsx";
import { showConfirm, hideConfirm } from "../../features/confirmSlice";

function Cards({ filterType }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const users = useSelector((state) => state.user.users);
  const user = useSelector((state) => state.user.user);
  const tenders = useSelector((state) => state.tenders.tenders)
  const searchFilters = useSelector((state) => state.search)

  const { isVisible, selectedTenderId } = useSelector((state) => state.confirm);
  
  const handleDeleteClick = (id) => {
    dispatch(showConfirm(id)); 
  };

  const handleConfirmYes = () => {
    dispatch(deleteTender(selectedTenderId)); 
    dispatch(hideConfirm()); 
  };

  const handleConfirmNo = () => {
    dispatch(hideConfirm()); 
  };

  const filteredTenders = useMemo(() => {
    let result = tenders || [];

    if (filterType === "all") {
      if (searchFilters.city) {
        result = result.filter((tender) => tender.city === searchFilters.city);
      }
      if (searchFilters.all) {
        result = result.filter(
          (tender) =>
            tender.subject.toLowerCase().includes(searchFilters.all.toLowerCase()) ||
            tender.owner.toLowerCase().includes(searchFilters.all.toLowerCase())
        );
      }
      if (searchFilters.minPrice) {
        result = result.filter((tender) => tender.price >= searchFilters.minPrice);
      }
      if (searchFilters.maxPrice) {
        result = result.filter((tender) => tender.price <= searchFilters.maxPrice);
      }
      if (searchFilters.startDate) {
        result = result.filter((tender) => tender.creationDate >= searchFilters.startDate);
      }
      if (searchFilters.endDate) {
        result = result.filter((tender) => tender.expirationDate <= searchFilters.endDate);
      }
    }

    if (filterType === "created") {
      result = result.filter((tender) => tender.userId === user?.id).reverse();
    }

    if (filterType === "bookmarked") {
      result = result.filter((tender) => user?.bookmarked?.includes(tender.id)).reverse();
    }

    if(filterType === "applied"){
      result = result.filter((tender) => user?.applied?.includes(tender.id)).reverse()
    }

    return result;
  }, [tenders, user?.id, user?.bookmarked, searchFilters, filterType]);


  useEffect(() => {
    dispatch(fetchTenders());
    dispatch(fetchAllUsers()); 
  }, [dispatch,filterType]);


  const paginate = (items, currentPage, itemsPerPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };
  
  
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredTenders.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  useEffect(() => {
    setCurrentPage(1); 
  }, [searchFilters, filterType]);

  const currentTenders = useMemo(() => {
    return paginate(filteredTenders, currentPage, itemsPerPage);
  }, [filteredTenders, currentPage, itemsPerPage]);

  const handleBookmarkClick = (id) => {
    if (user?.id) {
      dispatch(toggleBookmark({ tenderId: id, userId: user.id }));
    }
  }

  const isBookmarked = (id) => Array.isArray(user?.bookmarked) && user?.bookmarked.includes(id);

  const goToDetails = (id) => {
    navigate(`/detail/${id}`)
  }

  const handleEditClick = (tender) => {
    dispatch(setTenderToEdit(tender))
    dispatch(showCreateTenderForm())
  }

  const getTenderOwner = (userId) => {
    return users?.find((user) => user.id === userId);  
  };

  return (
    <div className="tenders" >
      <ul className="tenders-list">
        {currentTenders.length > 0 ? (
          currentTenders.map((tender) => (
            <li key={tender.id} className="tenders-list__item">
              <div className="tenders-list__photo">
                {
                getTenderOwner(tender.userId)?.picture ? (
                  <img src={getTenderOwner(tender.userId)?.picture} alt="" />
                ) : (
                  <span>{tender.owner[0]}</span>
                )
                }
              </div>
              <div className="tenders-list__information">
              <div className="tenders-list__owner">
                <h6 className="tenders-list__heading">Elan sahibi</h6>
                <p className="tenders-list__content">
                  {tender.owner.length > 150
                    ? `${tender.owner.slice(0, 150)}...`
                    : tender.owner}
                </p>
              </div>
              <div className="tenders-list__purpose">
                <h6 className="tenders-list__heading">Elanın predmeti</h6>
                <p className="tenders-list__content">
                  {tender.subject.length > 150
                    ? `${tender.subject.slice(0, 150)}...`
                    : tender.subject}
                </p>
              </div>
              <div className="tenders-list__activateTime">
                <div className="tenders-list__createTime">
                  <h6 className="tenders-list__heading">Elanın yaradılış tarixi</h6>
                  <p className="tenders-list__content">
                    <FaCalendarCheck className="calendar" />
                    {tender.creationDate}
                  </p>
                </div>
                <div className="tenders-list__expireTime mrg">
                  <h6 className="tenders-list__heading">Elanın bitmə tarixi</h6>
                  <p className="tenders-list__content">
                    <FaCalendarXmark className="calendar" />
                    {tender.expirationDate}
                  </p>
                </div>
                <div className="tenders-list__price mrg">
                <h6 className="tenders-list__heading">Şəhər</h6>
                <p className="tenders-list__content">
                <MdLocationCity className="calendar" />
                    {tender.city}
                  </p>
                </div>
                <div className="tenders-list__city mrg">
                <h6 className="tenders-list__heading">Qiymət</h6>
                <p className="tenders-list__content">
                <RiMoneyEuroBoxFill className="calendar"/>
                    {tender.price + " AZN"}
                  </p>
                </div>

              </div>
              <div className="tenders-list__actions">
                <button className="tenders-list__detail tenders-list__button" onClick={() => goToDetails(tender.id)}>
                  Ətraflı
                </button>
                <button onClick={() => handleEditClick(tender)} style={{ display: (filterType === "created" && user?.id) ? 'inline' : 'none' }} className="tenders-list__edit tenders-list__button">Düzəliş et</button>
                <button onClick={() => handleDeleteClick(tender.id)} style={{ display: (filterType === "created" && user?.id) ? 'inline' : 'none' }} className="tenders-list__delete tenders-list__button">Sil</button>
              </div>
            </div>
            <div onClick={() => handleBookmarkClick(tender.id)} className="tenders-list__save">
              {isBookmarked(tender.id) ? <FaBookmark className="saveIcon" /> : <FaRegBookmark className="saveIcon" />}
            </div>
            </li>
          ))
        ) : (
          <NotResult/>
        )}
      </ul>

      {isVisible && (
        <Confirm
          onConfirmYes={handleConfirmYes}
          onConfirmNo={handleConfirmNo}
        />
      )}     

      {pageNumbers.length > 1 && (
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={number === currentPage ? "active" : ""}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cards;
