import React from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import AwardGallery from './AwardGallery';

function importAll(r) {
    return r.keys().map(r);
}

// const images = importAll(require.context('../../image', false, /\.(png|jpe?g|svg)$/));

class App extends React.Component {
    constructor() {
        super();
        this.state = {width: -1};
    }

    componentDidMount() {
    }




    getImagesAndContest() {
        return async function () {
            try {
                const response = await fetch('http://bfawards.local/contest/running', {
                    credentials: 'same-origin'
                });
                const json = await response.json();
                this.setState({contestId: json.contest.id});
            } catch (e) {
                console.log('An error', e)
            }
        }
        // let url = `http://bfawards.local/contest/${this.state.contestId}/participant/${this.state.loginCpf}`;
        // let url = 'http://bfawards.local/contest/running';
    }



    render() {
        // let PHOTO_SET = [];
        //
        // let wid = 10;
        // let hei = 3;
        // images.map((row, index) => {
        //
        //         PHOTO_SET[index] =
        //             {
        //                 src: row,
        //                 width: sets[index].width,
        //                 height: sets[index].height
        //             }
        //         hei++
        //         wid++
        //     }
        // )
        if (this.state.photos) {
            const width = this.state.width;
            return (
                <Measure bounds onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
                    {
                        ({measureRef}) => {
                            if (width < 1) {
                                return <div ref={measureRef}></div>;
                            }
                            let columns = 1;
                            if (width >= 480) {
                                columns = 2;
                            }
                            if (width >= 1024) {
                                columns = 3;
                            }
                            if (width >= 1824) {
                                columns = 4;
                            }
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

ReactDOM.render(<App/>, document.getElementById('app'));
