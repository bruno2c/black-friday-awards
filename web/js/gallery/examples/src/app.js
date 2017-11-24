import React from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import fetch from 'isomorphic-fetch'
import AwardGallery from './AwardGallery';

function getImagesAndContest() {
    return async function () {
        try {
            const response = await fetch(baseUrl + `/contest/` + contestId, {
                credentials: 'same-origin'
            });
            const json = await response.json();
            this.setState({photos: json.images});

        } catch (e) {
            console.log('Cpf não encontrado', e)
        }
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {width: -1, winners: ''};
        this.getImagesAndContest = getImagesAndContest();
    }

    componentDidMount() {
        this.getImagesAndContest();
    }


    render() {
        if (this.state.photos) {
            const width = this.state.width;
            return (
                <Measure bounds onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
                    {
                        ({measureRef}) => {
                            if (width < 1) {
                                return <div ref={measureRef}></div>;
                            }
                            let columns = 4;
                            return <div ref={measureRef} className="App">
                                <AwardGallery columns={columns} photos={this.state.photos}/>
                            </div>
                        }
                    }
                </Measure>
            );
        } else {
            return (
                <div className="App">
                    <div id="msg-app-loading" className="loading-msg">
                        Loading
                    </div>
                </div>
            );
        }
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}
