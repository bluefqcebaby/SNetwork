import React, { FC, useRef, useState } from "react";
import s from "./SinglePost.module.sass";
import defaultImg from "../../../../img/default.jpg";
import { postView } from "../../../../models/PostView";
import parse from "html-react-parser";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useTypedDispatch, useTypedSelector } from "../../../../store/store";
import { deletePost } from "../../../../store/slices/postsSlice";
import { Link, useParams } from "react-router-dom";

const parseDate = (creationDate: Date): string => {
  let month = "";
  const date = new Date(creationDate);
  switch (date.getMonth()) {
    case 0:
      month = "Янв";
      break;
    case 1:
      month = "Фев";
      break;
    case 2:
      month = "Мар";
      break;
    case 3:
      month = "Апр";
      break;
    case 4:
      month = "Май";
      break;
    case 5:
      month = "Июн";
      break;
    case 6:
      month = "Июл";
      break;
    case 7:
      month = "Авг";
      break;
    case 8:
      month = "Сент";
      break;
    case 9:
      month = "Окт";
      break;
    case 10:
      month = "Нояб";
      break;
    case 11:
      month = "Дек";
      break;
  }
  return `${date.getDate()} ${month} ${date.getFullYear()}`;
};

interface Props extends postView {
  userId: string;
}

export const SinglePost: FC<Props> = ({
  id,
  name,
  surname,
  creationDate,
  text,
  avatar,
  postOwner,
  userId,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const loggedId = useTypedSelector(state => state.users.currentUser.id);
  const isAdmin = useTypedSelector(state => state.users.isAdmin);
  const dispatcher = useTypedDispatch();
  const clickHandler = async () => {
    await dispatcher(deletePost(id))
      .unwrap()
      .catch(err => console.log(err));
  };
  const link = `/user/${postOwner}`;
  const condition = isAdmin || loggedId === postOwner || loggedId === userId;
  return (
    <>
      <div className={s.menu}>
        {condition && (
          <BsThreeDotsVertical
            onClick={() => {
              ref.current?.classList.toggle(`${s.shown}`);
            }}
          />
        )}
        <div className={s.fullmenu} ref={ref}>
          <button className={s.menuBtn} onClick={clickHandler}>
            Удалить пост
          </button>
        </div>
      </div>
      <div className={s.firstBlock}>
        <Link to={link}>
          <img src={avatar ? avatar : defaultImg} alt='none' className={s.postImg} />
        </Link>
        <div className={s.textBlock}>
          <Link to={link} className={s.name}>
            {name} {surname}
          </Link>
          <p className={s.date}>{parseDate(creationDate)}</p>
        </div>
      </div>
      <div className={s.secondBlock}>{parse(text)}</div>
    </>
  );
};
