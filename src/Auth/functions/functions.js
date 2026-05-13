export const getProfilesApp = (profiles) =>{
    const profilesArray = [];
    profiles.map((perfil)=>{
      if(perfil.profile != 'AdminApp'){
        profilesArray.push({value: perfil.id, label: perfil.profile})
      }
    })
    return profilesArray;
  }