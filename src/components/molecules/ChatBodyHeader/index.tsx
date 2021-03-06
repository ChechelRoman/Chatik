import React from 'react';
import './style.scss';
import { Header3, Text1 } from '../../atoms/Typography';
import { UserAvatar } from '../../atoms/UserAvatar';
import backArrow from '../../../images/back-arrow-icon.svg';
export interface ContactHeaderProps {
  lastSeen?: string;
  contactName: string;
  onClick: React.MouseEventHandler<HTMLImageElement>;
  gender: string;
}

export const ChatBodyHeader: React.FC<ContactHeaderProps> = ({
  lastSeen,
  contactName,
  onClick,
  gender,
}) => {
  return (
    <div className="contact_header">
      <img
        className="back_arrow"
        src={backArrow}
        alt="back arrow icon"
        onClick={onClick}
      />
      <UserAvatar gender={gender} />
      <div className="info_wrapper">
        <Header3>{contactName}</Header3>
        <Text1>Last seen {lastSeen} minutes ago</Text1>
      </div>
    </div>
  );
};
