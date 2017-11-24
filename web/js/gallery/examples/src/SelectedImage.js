import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentUnSelect from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import ContentSelect from 'material-ui/svg-icons/toggle/check-box';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const imgStyle = {
  display: 'block',
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s'
};
const selectedImgStyle = {
  transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s'
};
const cont = {
  backgroundColor: '#eee',
  cursor: 'pointer',
  overflow: 'hidden',
  float: 'left',
  position: 'relative'
}

const SelectedImage = ({ index, onClick, photo, margin, selectClick}) => {
  //calculate x,y scale
  const sx = (100 - ((30 / photo.width) * 100)) / 100;
  const sy = (100 - ((30 / photo.height) * 100)) / 100;
  selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;
	return (
	    <MuiThemeProvider>
    <div style={{margin, width:photo.width, ...cont}} className={'cont' + (!photo.selected ? ' selected' : '')}>

      {/*<Checkmark selected={photo.selected ? true: false}/>*/}
      <img style={photo.selected ? {...imgStyle, ...selectedImgStyle} : {...imgStyle}} {...photo}  onClick={(e) => onClick(e, {index, photo})} />

      <style>
      {`.cont.selected:hover{outline:2px solid #06befa}`}
      </style>
            { photo.selected ?
                <FloatingActionButton  style={{  position: 'absolute', top: '78%',  left:'86%' }} onClick={(e) => selectClick(e, {index, photo})}  >
                <ContentSelect/>
                </FloatingActionButton>:
                <FloatingActionButton disabled={photo.disable ? true : false} secondary={true} style={{  position: 'absolute', top: '78%',  left:'86%' }} onClick={(e) => selectClick(e, {index, photo})}>
                <ContentUnSelect />
                </FloatingActionButton>
            }

    </div>
        </MuiThemeProvider>
  )
};

export default SelectedImage;
