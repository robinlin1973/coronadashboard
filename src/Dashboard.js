import React, { Component } from 'react';
//import { Layout,Row,Col,Tabs } from 'antd';
import { Layout} from 'antd';
import View1 from './views/View1';
import View2 from './views/View2';
import View3 from './views/View3';
//import View4 from './views/View4';
//import View5 from './views/View5';
import {latestDate} from './charts/util.js';
import View7 from './views/View7';
//import View8 from './views/View8';
import './dashboard.css';
import rawdata from './data/covid_19_data.csv';
//import rawdata from 'covid.csv';
import * as d3 from 'd3';

const { Sider, Content} = Layout;
//const {TabPane} = Tabs;

export default class Dashboard extends Component {

    state = {
        coronadata:null,
        selectedCountry:'United States',
    }

    componentDidMount(){

//        //todo update domain based on the max deaths number
        Promise.all([
            d3.csv(rawdata)
        ]).then( ([coronadata]) => {
            if(coronadata){
                this.setState({coronadata});
            }else{
                alert("wrong")
            }
        }).catch(err => alert(err))
    }

    handleCountryChanged=(country)=>{
//        console.log("handleCountryChanged",country);
        this.setState({selectedCountry: country});
    }

    render() {
        const {coronadata} = this.state;
        if(!coronadata){return null;}
        let lDate = latestDate(coronadata);
        let selectedCountry = this.state.selectedCountry;

        return (
            <div>
                <Layout style={{ height: 920 }}>
                    <Layout>
                        <Sider width={300} style={{backgroundColor:'#eee'}}>
                            <Content style={{ height: 900 }}>
                                <View1 data={coronadata} onCountryChanged={this.handleCountryChanged}/>
                            </Content>
                        </Sider>
                        <Layout style={{ height: 900 }}>
                            <Content style={{ height: 600 }}>
                                <View7 data={coronadata} selectedCountry={this.state.selectedCountry}/>
                            </Content>
                            <Content style={{ height: 300 }}>
                                <View3 data={coronadata} selectedCountry={this.state.selectedCountry}/>
                            </Content>
                        </Layout>

                        <Sider width={400} style={{backgroundColor:'#eee'}}>
                            <View2 data={coronadata} selectedCountry={selectedCountry} lDate={lDate}/>
                        </Sider>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

//                            <Tabs  type="card">
//
//
//                                <TabPane tab="World" key="1">
//                                    <Content>
//                                            <Row id="controlpanel" >
//                                                <Col span={3}>
//                                                    <div id="play"></div>
//                                                    <div><select id="datatype">
//                                                      <option id='datadeaths' defaultValue value="deaths">deaths</option>
//                                                      <option value="active">active</option>
//                                                      <option value="recovered">recovered</option>
//                                                    </select></div>
//                                                </Col>
//                                                <Col span={21}><div id="dateslider"></div></Col>
//                                            </Row>
//                                        <View7 data={coronadata}/>
//                                    </Content>
//                                </TabPane>
//
//                                <TabPane tab="US" key="2">
//
//                                </TabPane>
//
//                                <TabPane tab="China" key="3">
//
//                                </TabPane>
//
//                            </Tabs>



//                                <TabPane tab="Bubble" key="2">
//                                    <div id="yearslider"></div>
//                                    <div id="yearplay"></div>
//                                    <View6 data={coronadata}/>
//                                </TabPane>
