import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchPetData, fetchProfileData, deleteMedicalRecordItem } from "../../actions/";
import '../assets/css/modal.css';
import axios from 'axios';
import {readSessions} from "../../actions/index";

class PetProfile extends Component {
    constructor(props){
        super(props);

        this.state={
            canDelete: false,
            showModal: false,
            recordIndex: null,
            disconnect: false
        };
    }
    componentWillMount() {
        this.props.readSessions().then(()=>{
            if(!this.props.auth){
                this.props.history.push('/');
            }
            // console.log('these are the current props after read sessions', this.props);
            if(this.props.auth){
                let currentOwnerId= null;
                if(this.props.vetAccess){
                    currentOwnerId = this.props.match.params.alternativeId;
                    // console.log('this is the currentOwner Id ', currentOwnerId);
                }else{
                    currentOwnerId = this.props.sessionId;
                }
                this.props.fetchProfileData(this.props.match.params.id)
                    .then(()=>this.props.fetchPetData(currentOwnerId));
            }
        });

    }
    softDeleteRecord() {
        const {recordIndex} =this.state;
        const petProfileData= this.props.petProfile;
        this.props.deleteMedicalRecordItem(petProfileData[recordIndex]['recordID']).then(()=>{
            this.props.fetchProfileData(this.props.match.params.id).then(
                this.setState({...this.state, showModal: false, canDelete: false,})
            )
        });
    }
    //////****THIS IS WHERE YOU DISCONNECT VET FUNCTION. THROW AXIOS CALL IN HERE.****/////////
    disconnectVet(){
        const petDataArray= this.props.petdata;
        const ownerId = this.props.sessionId;
        const petId= this.props.match.params.id;
        for (var i =0; i< petDataArray.length; i++){
            if(petDataArray[i]['ID']===petId){
                var vetName= petDataArray[i].vet;
            }
        }
        const url = '/server/database_connect/server.php?action=post&resource=disconnectPet';
        axios({
            method: 'post',
            dataType: 'json',
            url: url,
            data: {
                oldVetName: vetName,
                petID: petId,
                ownerID: ownerId,
            }
        }).then(res => {
            // console.log('these are the props after clicking disconnect vet', this.props);
            let currentOwnerId = this.props.sessionId;
            this.props.fetchProfileData(this.props.match.params.id)
                .then(()=>this.props.fetchPetData(currentOwnerId)).then(
                this.setState({...this.state, showModal: false, disconnect: false}))
        });

    }
    getPetInfo() {
        if(!this.props.petdata.length) return;
        let petObj = null;
        for (var i = 0; i < this.props.petdata.length; i++) {
          if (this.props.petdata[i]["ID"] === this.props.match.params.id) {
            petObj = this.props.petdata[i];
          }
        }
        const petImage = {
            backgroundImage: `url(${petObj.avatar})`
        };
        if (petObj.vet !== 'No vet connected') {
            var vetName = 'Dr. ' + petObj.vet;
        } else {
            var vetName = petObj.vet;
        }
        return (
          <div className="petInfoContainer">
            <div className="petImgContainer">
              <div className="petAvatar petAvatarProfile" style={petImage} />
            </div>
            <div className="petInfoDiv">
              <div className="innerPetInfoContainer">
                <h4>Name: {petObj.name}</h4>
                <h4>DOB: {petObj.dob}</h4>
                <h4>Breed: {petObj.breed}</h4>
                <h4>Vet: {vetName}</h4>
                  <div className='connectPetBtn'>
                      <Link to={petObj.vet==='No vet connected'? `/pet-to-vet/${this.props.match.params.id}/null`:
                          `/pet-to-vet/${this.props.match.params.id}/${petObj.vet}`}>
                          <button className='btn btn-warning'
                                  style={this.props.vetAccess || this.state.canDelete && petObj.vet !== 'No vet connected' ? {'display':'none'}: {'display':'inline-block'}}>
                              {petObj.vet!=='No vet connected'? 'Change Current Vet?' :'Connect this Pet to Vet?'}
                          </button>
                      </Link>
                      <button className='btn btn-danger'
                              /* onClick={()=>this.disconnectVet()} */
                              onClick={()=>this.triggerDisconnectModal()}
                              style={this.state.canDelete && petObj.vet!=='No vet connected'? {'display':'inline-block'}: {'display':'none'}}>
                          Disconnect Vet
                      </button>
                  </div>
              </div>
            </div>
          </div>
        );
    }
    listMedicalRecords() {
          const petId = this.props.match.params.id;
          const medicalRecordsList = this.props.petProfile.map((item, index) => {
              return (
                <div className="recordContainer" key={index}>

                    <i onClick={()=>this.triggerModal(index)}  className={this.state.canDelete? "deleteBtnPetProfile fa fa-times-circle fa-2x aria-hidden=true": ''} ></i>

                    <h3 className='medicalRecord'>
                    <Link to={"/pet-profile/" + petId + "/record-item/" + this.props.petProfile[index]["recordID"]}>
                          {item.type}
                    </Link>
                  </h3>
                </div>
              );
            });
          return medicalRecordsList;
    }
    //////////TRIGGER MODAL HERE//////////
    triggerModal(index) {
        this.setState({...this.state, showModal:true, recordIndex: index});
    }
    triggerDisconnectModal() {
        this.setState({...this.state, showModal:true, disconnect: true});
    }
    //////////SHOW MODAL HERE//////////
    showModal(){
        const {recordIndex}= this.state;
        return(
            <span>
              <div className='confirm-modal '>
                  <div className="content-modal">
                      <div className="card">
                          <div className="card-header">Are you sure you want to {!this.state.disconnect ? "delete:" : "disconnect from vet?"}</div>
                          {!this.state.disconnect ?  
                          <div>
                          <div className="card-block">
                              <div className="card-title">
                                  <h5>Medical Record:</h5>
                              </div>
                          </div>
                          <div className='card-block'>
                              <h2 className='font-weight-bold'>{this.props.petProfile[recordIndex].type}</h2>
                          </div> 
                          </div>
                          : ""}
                          <div className="card-footer">
                                <button onClick={!this.state.disconnect 
                                    ? ()=> this.softDeleteRecord() 
                                    : ()=>this.disconnectVet() }
                                    className='btn btn-outline-success'>Confirm</button>
                                <button onClick={()=> this.setState({...this.state, showModal: false, canDelete: false, disconnect: false})} className='btn btn-outline-danger'>Cancel</button>
                          </div>
                      </div>
                  </div>
              </div>
            </span>
        )
    }
    render() {
        // console.log('this is the pet data after rendering ', this.props);
        var found = false;
        for(var i = 0; i <this.props.petdata.length; i++){
          if(this.props.petdata[i]['ID'] === this.props.match.params.id){
            found = true
          }
        }
        if(!found) return <h1>Loading</h1>;
        let petName = null;
            for (var i = 0; i < this.props.petdata.length; i++) {
              if (this.props.petdata[i]["ID"] === this.props.match.params.id) {
                petName = this.props.petdata[i].name;
              }
        }
        const toggleCanDelete= !this.state.canDelete;
        const {showModal}= this.state;
        return (
          <div className='bodyContainer'>
            {this.getPetInfo()}
            <div className="medicalRecord">
              <div className="text-center">
                <h1 className='listTitle'>Record List for {petName}</h1>
                  {this.props.petProfile.length ?  this.listMedicalRecords() : <h1 className="noPetData">No Pet Records</h1>}
                  <div className='btnContainerPetProfile' style={this.props.vetAccess ? {'display': 'none'}: {'display': 'inline'} }>
                      <button className={!this.state.canDelete? 'editBtn btn btn-outline-danger':'editBtn btn btn-outline-warning'}
                              onClick={()=>{this.setState({canDelete: toggleCanDelete})}}>{!this.state.canDelete? "Edit Profile": 'Cancel'}
                      </button>
                      <Link to={`/pet-profile/${this.props.match.params.id}/add/med-note/`}>
                          <button className= "btn btn-outline-success addMedicalRecord">
                              Add Medical Record
                          </button>
                      </Link>
                      {showModal? this.showModal(): ''}
                  </div>
              </div>
            </div>
          </div>
        );
      }
}
function mapStateToProps(state) {
    return {
        petdata: state.petdata,
        petProfile: state.petProfile,
        deleteMedicalRecordItem: state.deleteMedicalRecordItem,
        // vetAccessLevel: state.vetlogin.accessLevel,
        // ownerId: state.login.id,
        auth: state.sessions.auth,
        sessionId: state.sessions.id,
        vetAccess: state.sessions.vetAccess

  };
}
export default connect(mapStateToProps, {
    fetchPetData: fetchPetData,
    fetchProfileData: fetchProfileData,
    deleteMedicalRecordItem: deleteMedicalRecordItem,
    readSessions: readSessions
})(PetProfile);
