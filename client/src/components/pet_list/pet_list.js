import React, { Component } from "react";
import "./new_pet_list_styles.css";
import Logo from '../../assets/images/petvet_logo.png';
import pet_data from "../../../../server/pet_data";
import {Link} from 'react-router-dom';


class PetList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    // debugger;
    const userPetList = this.props.data.map((item, index) => {
      const petAvatar = {
        backgroundImage: `url(${item.avatar})`
      };
      console.log(item);
      return (
        <div key={index}>
          <Link to={"/pet-profile/" + index}>
            <div className="petAvatar" style={petAvatar} id={index} />
            <h3 className="petName">{item.name}</h3>
          </Link>
        </div>
      );
    });
    return (
      <div>
        <header>
          <div className="title"><img src={Logo}/></div>
        </header>
        <div className="petListContainer">
          <h1 className="petListTitle">Pet List</h1>
          <div className="usersPetContainer">{userPetList}</div>
        </div>
      </div>
    );
  }
}

export default PetList;
