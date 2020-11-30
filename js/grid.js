let graphDate = new Date(); // initGraphTime() || section.js -> setTodayDate();
graphDate.setFullYear(2019);
graphDate.setMonth(6 - 1);
graphDate.setDate(20);

const USER_ID = '1nhBflpO9ehPOndqzldvHWB3ILS2';
const USER_DATE = '2019-06-20';
const USER_TIME = '04:00:00';
function getDateString(param_date) {
    const year = param_date.getFullYear();
    const month = param_date.getMonth() + 1 < 10? `0${param_date.getMonth() + 1}` : `${param_date.getMonth() + 1}`;
    const date = param_date.getDate();

    return `${year}-${month}-${date}`;
}

let todayUserData = {
    calory : 1000,
    step : 1205,
    distance : 2.1,
    sitting : 3, 
    waist : 23
};

function getTodayUserData(user_id, date, time, callback) {
    todayUserData = getUserData(user_id,date,time);
    callback();
} 

window.addEventListener('DOMContentLoaded', function() {
    getTodayUserData(USER_ID, USER_DATE, USER_TIME, initData);

    Sortable.create(dashGrid, { 
        handle: '.handle',
        swapThreshold: 1,
        animation: 150,
    });

    /*// ===== 그래프 ===== 
    const menuHtml = [
        `<div class="graph-radio-wrapper swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0">
            <input type="radio" id="walk" name="graphmenu" value="walk" checked>
            <label for="walk">걸음수</label>
        </div>`,
        `<div class="graph-radio-wrapper swiper-pagination-bullet" tabindex="0">
            <input type="radio" id="waist" name="graphmenu" value="waist">
            <label for="waist">허리둘레</label>
        </div>`,
        `<div class="graph-radio-wrapper swiper-pagination-bullet" tabindex="0">
            <input type="radio" id="overeating" name="graphmenu" value="overeating">
            <label for="overeating">칼로리</label>
        </div>`
    ];
    const swiper_item1 = new Swiper('.swiper-container.item-1', {
        pagination: {
            el: '.graph-menu',
            clickable: true,
                renderBullet: function (index, className) {
                return menuHtml[index];
            },
        },
    });*/

    const swiper_item5 = new Swiper('.swiper-container.item-5', {
        navigation: {
            nextEl: '.swiper-button-next.item-5',
            prevEl: '.swiper-button-prev.item-5',
        },
    });
});

function initData() {
    getDataSet(USER_DATE);
    initGraphSection();
    addTimeRateClickEvent();
    addMenuClickElement(addMenuClickEvent);
    addChangeTimeEvent();
    initGraphTime();
    // ================== 

    // ====== 랭킹 ====== 
    initRankSection();
    addRankMenuClickEvent();
    // ================== 

    // ====== 칼로리 ======
    initKcalSection();
    // ================== 

    // ====== 과식 ======
    initOvereatingSection();
    // ================== 

    // ====== 걸음 수 / 걸은 거리 ======
    initWalkSection();
    // ================== 

    // ====== 운동 정보 ======
    initYoutubeInfo();
    // ==================
}

// ============================= 그래프 =============================
let globalDataSet;
function getDataSet(date) {
    let dataset = getTimeIntervalData(USER_ID, date);

    for(let i = 0; i < 3; i++) {
        const menuidx = ["menu1", "menu2", "menu3"];
        if(dataset[i][menuidx[i]][0].date.length != 7) {
            const day = ['일', '월', '화', '수', '목', '금', '토'];
            let today = dataset[i][menuidx[i]][0].date.length-1;
    
            while(today < 6) {
                today++;
                dataset[i][menuidx[i]][0].date.push(day[today]);
                dataset[i][menuidx[i]][0].data.push(0);
            }
        }
    }

    for(let i = 0; i < 3; i++) {
        const menuidx = ["menu1", "menu2", "menu3"];
        if(dataset[i][menuidx[i]][2].date.length != 12) {
            const day = ['1월', '2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
            let today = dataset[i][menuidx[i]][2].date.length-1;
    
            while(today < 11) {
                today++;
                dataset[i][menuidx[i]][2].date.push(day[today]);
                dataset[i][menuidx[i]][2].data.push(0);
            }
        }
    }

    globalDataSet = dataset;
}

function initGraphSection() {
    /*const dataset = [ // *** 하단의 데이터를 함수로 받아와야함 ***
        { // 걸음수(요일별)
            data : [102, 222, 1233, 2344, 235, 26, 17],
            date : ['일', '월', '화', '수', '목', '금', '토']
        },
        { // 허리둘레(요일별)
            data : [24, 25, 27, 27, 27, 26, 26],
            date : ['일', '월', '화', '수', '목', '금', '토']
        },
        { // 과식(요일별)
            data : [2, 0, 0, 1, 3, 4, 4],
            date : ['일', '월', '화', '수', '목', '금', '토']
        }
    ];*/


    //const dataset = getGraphData(USER_DATE, null, 0);
    let returnData = [];
    returnData.push(globalDataSet[0]["menu1"][0]);
    returnData.push(globalDataSet[1]["menu2"][0]);
    returnData.push(globalDataSet[2]["menu3"][0]);
    const dataset = returnData;

    // 처음 화면에 보여지는 걸음수||허리둘레||과식 별 데이터를 설정
    dataset.forEach(function(d, i) {
        createGraphInfo(d, `menu${i+1}`);
    });
}

function addMenuClickElement(callback) {
    const menuHtml = [
        `<div class="graph-radio-wrapper swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0">
            <input type="radio" id="walk" name="graphmenu" value="walk" checked>
            <label for="walk">걸음수</label>
        </div>`,
        `<div class="graph-radio-wrapper swiper-pagination-bullet" tabindex="0">
            <input type="radio" id="waist" name="graphmenu" value="waist">
            <label for="waist">허리둘레</label>
        </div>`,
        `<div class="graph-radio-wrapper swiper-pagination-bullet" tabindex="0">
            <input type="radio" id="overeating" name="graphmenu" value="overeating">
            <label for="overeating">칼로리</label>
        </div>`
    ];
    const swiper_item1 = new Swiper('.swiper-container.item-1', {
        pagination: {
            el: '.graph-menu',
            clickable: true,
                renderBullet: function (index, className) {
                return menuHtml[index];
            },
        },
    });

    callback();
}
function addMenuClickEvent() {
    const menuEl = document.querySelectorAll('.graph-radio-wrapper');
    menuEl.forEach(function(el) {
        el.addEventListener('click', function() {
            if(getDateString(graphDate) != USER_DATE) {
                getDataSet(USER_DATE);
            }
            document.querySelector('.timerate.checked').className = 'timerate';
            document.querySelector('.timerate').className = 'timerate checked';
            document.querySelector('.swiper-pagination-bullet-active').classList.toggle('swiper-pagination-bullet-active');
            el.classList.toggle('swiper-pagination-bullet-active');
            changeGraphTimeRate('rate-day');
            initGraphTime();
        });
    });
}

function addTimeRateClickEvent() {
    const timerateEl = document.querySelectorAll('.timerate');
    
    timerateEl.forEach(function(el) {
        el.addEventListener('click', function() {
            document.querySelector('.timerate.checked').className = 'timerate';
            el.className = 'timerate checked';
            
            if(getDateString(graphDate) != USER_DATE) {
                getDataSet(USER_DATE);
            }
            
            changeGraphTimeRate(el.id);
            changeGraphInfoFromTimeRate(el.id);
        });
    });
}

function changeGraphTimeRate(elementId) {
    let timerate;
    switch(elementId) {
        case 'rate-day': timerate = 0; break;
        case 'rate-week': timerate = 1; break;
        case 'rate-month': timerate = 2; break;
    }

    let menu = document.querySelector('.swiper-pagination-bullet-active > input').id;
    switch(menu) {
        case 'walk': menu = 'menu1'; break;
        case 'waist': menu = 'menu2'; break;
        case 'overeating': menu = 'menu3'; break;
    }

    /*const dataset = [  // *** 하단의 데이터를 함수로 받아와야함 ***
        { // 현재 메뉴의 데이터(요일별)
            data : [102, 222, 1233, 2344, 235, 26, 17],
            date : ['일', '월', '화', '수', '목', '금', '토']
        },
        { // 현재 메뉴의 데이터(주간별)
            data : [200291, 400291, 100291, 500291, 220201],
            date : ['10월-1째', '10월-2째', '10월-3째', '10월-4째', '10월-5째']
        },
        { // 현재 메뉴의 데이터(월별)
            data : [200291, 400291, 100291, 500291, 220201, 200291, 400291, 100291, 500291, 220201, 220132, 333022],
            date : ['1월', '2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
        }
    ];*/

    //const dataset = getGraphData(getDateString(graphDate), menu, null);
    let returnData;
    if(menu == 'menu1') {
        returnData = globalDataSet[0]["menu1"];
    } else if(menu == 'menu2') {
        returnData = globalDataSet[1]["menu2"];
    } else if(menu == 'menu3') {
        returnData = globalDataSet[2]["menu3"];
    }
    const dataset = returnData;

    const svg = document.querySelector(`.d3-graph.${menu}`); 
    while(svg.hasChildNodes()) { 
        svg.removeChild(svg.firstChild);
    }
    createGraphInfo(dataset[timerate], menu);
}

function addChangeTimeEvent() {
    const prevButtonEl = document.querySelector('.graph-button-prev');
    const nextButtonEl = document.querySelector('.graph-button-next');

    prevButtonEl.addEventListener('click', function() {
        const timerate = document.querySelector('.timerate.checked').id;

        switch(timerate) {
            case 'rate-day': {
                lastWeek();
                setGraphTime();
            } break;
            case 'rate-week': {
                lastMonth();
                setGraphTime();
            } break;
            case 'rate-month': {
                lastYear();
                setGraphTime();
            } break;
        }

        getDataSet(getDateString(graphDate));
        changeGraphTimeRate(timerate);
        setGraphTime();
    });

    nextButtonEl.addEventListener('click', function() {
        const timerate = document.querySelector('.timerate.checked').id;

        switch(timerate) {
            case 'rate-day': {
                nextWeek();
                setGraphTime();
            } break;
            case 'rate-week': {
                nextMonth();
                setGraphTime();
            } break;
            case 'rate-month': {
                nextYear();
                setGraphTime();
            } break;
        }
    });
}

function initGraphTime() {
    graphDate = new Date();
    graphDate.setFullYear(2019);
    graphDate.setMonth(6 - 1);
    graphDate.setDate(20);
    
    const graphDateInfoEl = document.querySelector('.graph-date-info');

    const first_day = getSettingDate(graphDate, graphDate.getDay()*(-1)); 
    const last_day  = getSettingDate(graphDate, 6-graphDate.getDay()); 

    graphDateInfoEl.innerText = `${first_day.year}.${first_day.month}.${first_day.day} ~ ${last_day.year}.${last_day.month}.${last_day.day}`;
}

function setGraphTime() {
    const graphDateInfoEl = document.querySelector('.graph-date-info');
    const timerate = document.querySelector('.timerate.checked').id;

    switch(timerate) {
        case 'rate-day': {
            const first_day = getSettingDate(graphDate, graphDate.getDay()*(-1)); 
            const last_day  = getSettingDate(graphDate, 6-graphDate.getDay()); 
            graphDateInfoEl.innerText = `${first_day.year}.${first_day.month}.${first_day.day} ~ ${last_day.year}.${last_day.month}.${last_day.day}`;
        } break;
        case 'rate-week': {
            const day = getDateStr(graphDate);
            graphDateInfoEl.innerText = `${day.year}-${day.month}월`;
        } break;
        case 'rate-month': {
            const day = getDateStr(graphDate);
            graphDateInfoEl.innerText = `${day.year}년`;
        } break;
    }
    
}

function changeGraphInfoFromTimeRate(elementId) {
    const graphDateInfoEl = document.querySelector('.graph-date-info');

    switch(elementId) {
        case 'rate-day': {
            initGraphTime();
        } break;
        case 'rate-week': {
            initGraphTime();
            const day = getDateStr(graphDate);
            graphDateInfoEl.innerText = `${day.year}-${day.month}월`;
        } break;
        case 'rate-month': {
            initGraphTime();
            const day = getDateStr(graphDate);
            graphDateInfoEl.innerText = `${day.year}년`;
        } break;
    }
}

function getDateStr(myDate){
	const year = myDate.getFullYear();
	let month = (myDate.getMonth() + 1);
	let day = myDate.getDate();
	
	month = (month < 10) ? "0" + String(month) : month;
	day = (day < 10) ? "0" + String(day) : day;
	
    return { 
        year : year,
        month : month,
        day : day 
    };
}

function getSettingDate(date, value) {
    const tmpDate = new Date(date.getTime());
    
    const dayOfMonth = tmpDate.getDate();
    tmpDate.setDate(dayOfMonth + value);
    
    return getDateStr(tmpDate);
}

function lastWeek() {
    const dayOfMonth = graphDate.getDate();
    graphDate.setDate(dayOfMonth - 7);
    
    return getDateStr(graphDate);
}
function nextWeek() {
    const dayOfMonth = graphDate.getDate();
    graphDate.setDate(dayOfMonth + 7);
    
    return getDateStr(graphDate);
}
function lastMonth() {
    const monthOfYear = graphDate.getMonth();
    graphDate.setMonth(monthOfYear - 1);
   
    return getDateStr(graphDate);
}
function nextMonth() {
    const monthOfYear = graphDate.getMonth();
    graphDate.setMonth(monthOfYear + 1);
    
    return getDateStr(graphDate);
}
function lastYear() {
    const year = graphDate.getFullYear();
    graphDate.setFullYear(year - 1);
   
    return getDateStr(graphDate);
}
function nextYear() {
    const year = graphDate.getFullYear();
    graphDate.setFullYear(year + 1);
    
    return getDateStr(graphDate);
}


function createGraphInfo(dataset, menu) {
    const data = dataset.data;
    const date = dataset.date;

    const width = 500, height = 250; 
    const xAxis_subLen = 80;

    const svg = d3.select(`.d3-graph.${menu}`)
                .attr("width", width)
                .attr("height", height);
    
    // x축
    const xAxis = d3.scaleBand()
    .range([0, width-xAxis_subLen])
    .domain(date);
    
    svg.append("g")
        .attr("transform", "translate(50, 230)")
        .call(d3.axisBottom(xAxis))

    // y축
    const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, height-50]);

    const yAxis = d3.scaleLinear()
    .range([height-50, 0])
    .domain([0, d3.max(data)]);
    
    svg.append("g")
    .attr("transform", "translate(50, 30)")
    .call(d3.axisLeft(yAxis));

    // 색상
    var colors = d3.scaleQuantize()
    .domain([0,d3.max(data)])
    .range(["#5CBD69", "#2A8636", "#02BA1A", "#016E10", "#013D09"]);
          
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append('rect')
        .attr("fill", function(d) {
            return colors(d);
        })
        .attr('width', function(d) {
            return 20;
        })
        .attr('height', function(d) {
            return yScale(d);
        })
        .attr('x', function(d, i) {
            return 50 + ((width-xAxis_subLen)/date.length/2 - 10) +((width-xAxis_subLen)/date.length)*i;
        })
        .attr('y', function(d, i) {
            return 230 - yScale(d);
        })
        .attr('num', function(d, i) {
            return i;
        })
        .on('mouseover', function(d) {
            // 텍스트
            d3.select(this)
            .attr('fill', 'orange');

            const idx = parseInt(d3.select(this).attr('num'));
            const value = parseInt(data[idx]);
            d3.select(`#tooltip.${menu}`)
            .select('#value')
            .text(value);
            
            const xPos = 50 - (String(value).length*2.5-2) + ((width-xAxis_subLen)/date.length/2 - 10) +((width-xAxis_subLen)/date.length)*idx;
            const yPos = 225 - yScale(value);
            d3.select(`#tooltip.${menu}`)
            .attr('style', `left:${xPos}px; top:${yPos}px`);

            d3.select(`#tooltip.${menu}`).classed('hidden', false);
        })
        .on('mouseout', function(d) {
            const idx = parseInt(d3.select(this).attr('num'));
            const value = data[idx];
            d3.select(this)
            .attr('fill', () => colors(value));

            d3.select(`#tooltip.${menu}`).classed('hidden', true);
        });
}

function getGraphData(date, menu, timerate) { // menu1, menu2, menu3, 0,1,2
    
    let dataset = getTimeIntervalData(USER_ID, date);

    for(let i = 0; i < 3; i++) {
        const menuidx = ["menu1", "menu2", "menu3"];
        if(dataset[i][menuidx[i]][0].date.length != 7) {
            const day = ['일', '월', '화', '수', '목', '금', '토'];
            let today = dataset[i][menuidx[i]][0].date.length-1;
    
            while(today < 6) {
                today++;
                dataset[i][menuidx[i]][0].date.push(day[today]);
                dataset[i][menuidx[i]][0].data.push(0);
            }
        }
    }

    for(let i = 0; i < 3; i++) {
        const menuidx = ["menu1", "menu2", "menu3"];
        if(dataset[i][menuidx[i]][2].date.length != 12) {
            const day = ['1월', '2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
            let today = dataset[i][menuidx[i]][2].date.length-1;
    
            while(today < 11) {
                today++;
                dataset[i][menuidx[i]][2].date.push(day[today]);
                dataset[i][menuidx[i]][2].data.push(0);
            }
        }
    }
    

    console.log(dataset);
    /*const dataset = {
        "menu1" : [
            { // 걸음수 데이터(요일별)
                data : [102, 222, 1233, 2344, 235, 26, 17],
                date : ['일', '월', '화', '수', '목', '금', '토']
            },
            { // 걸음수 데이터(주간별)
                data : [200291, 400291, 100291, 500291, 220201],
                date : ['10월-1째', '10월-2째', '10월-3째', '10월-4째', '10월-5째']
            },
            { // 걸음수 데이터(월별)
                data : [200291, 400291, 100291, 500291, 220201, 200291, 400291, 100291, 500291, 220201, 220132, 333022],
                date : ['1월', '2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
            }
        ],
        "menu2" : [
            { // 허리둘레 데이터(요일별)
                data : [24, 25, 27, 27, 27, 26, 26],
                date : ['일', '월', '화', '수', '목', '금', '토']
            },
            { // 허리둘레 데이터(주간별)
                data : [24, 27, 29, 29, 33],
                date : ['10월-1째', '10월-2째', '10월-3째', '10월-4째', '10월-5째']
            },
            { // 허리둘레 데이터(월별)
                data : [24, 25, 27, 28, 29, 33, 44, 55, 56, 53, 11, 32],
                date : ['1월', '2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
            }
        ],
        "menu3" : [
            { // 과식 데이터(요일별)
                data : [2, 0, 0, 1, 3, 4, 4],
                date : ['일', '월', '화', '수', '목', '금', '토']
            },
            { // 과식 데이터(주간별)
                data : [14, 27, 22, 5, 1],
                date : ['10월-1째', '10월-2째', '10월-3째', '10월-4째', '10월-5째']
            },
            { // 과식 데이터(월별)
                data : [231, 223, 231, 112, 231, 222, 11, 32, 115, 53, 5, 2],
                date : ['1월', '2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
            }
        ]
    };*/

    if(menu == null) { // 각 메뉴마다의 요일별 데이터
        let returnData = [];
        returnData.push(dataset[0]["menu1"][0]);
        returnData.push(dataset[1]["menu2"][0]);
        returnData.push(dataset[2]["menu3"][0]);
        
        return returnData;
    }
    else if(timerate == null) { // 해당 메뉴의 요일별/주간별/월별 데이터
        if(menu == 'menu1') {
            return dataset[0]["menu1"];
        } else if(menu == 'menu2') {
            return dataset[1]["menu2"];
        } else if(menu == 'menu3') {
            return dataset[2]["menu3"];
        }
    }
}
// ==================================================================

// ============================= 랭킹 =============================
let userData = [];
function initRankSection() {
    let dataset = [];
    dataset.push(getRankingData(USER_ID, 0, USER_DATE));
    dataset.push(getRankingData(USER_ID, 1, USER_DATE));
    dataset.push(getRankingData(USER_ID, 2, USER_DATE));

    const slideEl = document.querySelectorAll('.swiper-slide.item-5');
    const unit = ['걸음', '인치', 'kcal'];
    slideEl.forEach(function(el, idx) {
        const data = dataset[idx]["top5 rank"];
        const r_name = [
            ['박OO', '최OO', '김OO', '정OO', '유OO'],
            ['박OO', '정OO', '유OO', '소OO', '마OO'],
            ['박OO', '성OO', '지OO', '추OO', '유OO']
        ];

        let innerText = ``;
        for(let i = 0; i < 5; i++) {
            innerText += `<li><div>${i+1}위</div><div><img src="img/icon/user-icon-black.png">&nbsp;${r_name[idx][i]}</div><div>${parseInt(data[i].value)} ${unit[idx]}</div></li>`;
        }
        el.innerHTML = `<ul>${innerText}</ul>`;
    });

    userData.push(dataset[0].user_rank[0]);
    userData.push(dataset[1].user_rank[0]);
    userData.push(dataset[2].user_rank[0]);
    
    const profileEl = document.querySelector('.profile-summary');
    profileEl.innerHTML = `${parseInt(userData[0].value)} ${unit[0]}`;

    const rankPercentEl = document.querySelector('.rank-percent');
    rankPercentEl.innerHTML = `상위 ${parseInt(userData[0].rank/40*100.0)} %`;

    const rankSummaryEl = document.querySelector('.rank-summary');
    let rankText = '';
    const rankPercent = parseInt(userData[0].rank/40*100.0);
    if(rankPercent <= 10) {
        rankText = `이보다 더 좋을 수 없어요!`;
    }
    else if(rankPercent <= 20) {
        rankText = `건강관리를 잘 하고 계시네요~`;
    }
    else if(rankPercent <= 50) {
        rankText = `남들보다 더 건강해지려면 더 노력하세요!`;
    }
    else if(rankPercent <= 20) {
        rankText = `건강관리에 노력이 필요합니다!`;
    }

    rankSummaryEl.innerHTML = rankText;
}

function addRankMenuClickEvent() {
    const prevEl = document.querySelector('.swiper-button-prev.item-5');
    const nextEl = document.querySelector('.swiper-button-next.item-5');
    const menuText = ['걸음수', '허리둘레', '소모 칼로리'];
    const unit = ['걸음', '인치', 'kcal'];

    prevEl.addEventListener('click', function() {
        let menu;
        if(prevEl.getAttribute('aria-disabled') == 'false' && nextEl.getAttribute('aria-disabled') == 'false') {
            menu = 0; // 허리둘레 -> 걸음수
        } else if(prevEl.getAttribute('aria-disabled') == 'false' && nextEl.getAttribute('aria-disabled') == 'true') {
            menu = 1; // 소모 칼로리 -> 허리둘레
        } else {
            menu = 2;
        }
        
        document.querySelector('.swiper-button-menu.item-5').innerHTML = menuText[menu];

        const profileEl = document.querySelector('.profile-summary');
        profileEl.innerHTML = `${parseInt(userData[menu].value)} ${unit[menu]}`;
        const rankPercentEl = document.querySelector('.rank-percent');
        rankPercentEl.innerHTML = `상위 ${parseInt(userData[menu].rank/40*100.0)} %`;

        const rankSummaryEl = document.querySelector('.rank-summary');
        let rankText = '';
        const rankPercent = parseInt(userData[menu].rank/40*100.0);
        if(rankPercent <= 10) {
            rankText = `이보다 더 좋을 수 없어요!`;
        }
        else if(rankPercent <= 20) {
            rankText = `건강관리를 잘 하고 계시네요~`;
        }
        else if(rankPercent <= 50) {
            rankText = `남들보다 더 건강해지려면 더 노력하세요!`;
        }
        else if(rankPercent <= 20) {
            rankText = `건강관리에 노력이 필요합니다!`;
        }

        rankSummaryEl.innerHTML = rankText;
    });

    nextEl.addEventListener('click', function() {
        let menu;
        if(prevEl.getAttribute('aria-disabled') == 'true' && nextEl.getAttribute('aria-disabled') == 'false') {
            menu = 1; // 걸음수 -> 허리둘레
        } else if(prevEl.getAttribute('aria-disabled') == 'false' && nextEl.getAttribute('aria-disabled') == 'false') {
            menu = 2; // 허리둘레 -> 소모 칼로리
        } else {
            menu = 0;
        }

        document.querySelector('.swiper-button-menu.item-5').innerHTML = menuText[menu];

        const profileEl = document.querySelector('.profile-summary');
        profileEl.innerHTML = `${parseInt(userData[menu].value)} ${unit[menu]}`;
        const rankPercentEl = document.querySelector('.rank-percent');
        rankPercentEl.innerHTML = `상위 ${parseInt(userData[menu].rank/40*100.0)} %`;

        const rankSummaryEl = document.querySelector('.rank-summary');
        let rankText = '';
        const rankPercent = parseInt(userData[menu].rank/40*100.0);
        if(rankPercent <= 10) {
            rankText = `이보다 더 좋을 수 없어요!`;
        }
        else if(rankPercent <= 20) {
            rankText = `건강관리를 잘 하고 계시네요~`;
        }
        else if(rankPercent <= 50) {
            rankText = `남들보다 더 건강해지려면 더 노력하세요!`;
        }
        else {
            rankText = `건강관리에 노력이 필요합니다!`;
        }

        rankSummaryEl.innerHTML = rankText;
    });
}
// ==================================================================


// ============================= 칼로리 =============================
function initKcalSection() {
    const kcalSectionEl = document.querySelector('.kcal-section');
    
    // *** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = todayUserData.calory;

    kcalSectionEl.innerHTML = `${userdata.toFixed(2)}kcal`;
}
// ==================================================================

// ============================= 앉은 시간 =============================
function initOvereatingSection() {
    const overeatingValueEl = document.querySelector('.overeating-value');
    const overeatingNoticeEl = document.querySelectorAll('.overeating-notice');
    // *** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = { value : todayUserData.sitting }; 
    let status = 0; // status => 0 : 양호 | 1 : 관심 | 2 : 주의

    if(userdata.value < 60) {
        status = 0;
    }
    else if(userdata.value < 180) {
        status = 1;
    }
    else {
        status = 2;
    }

    overeatingValueEl.innerHTML = `${userdata.value}분`;
    overeatingNoticeEl[status].classList.toggle('active');


}
// ==================================================================

// ============================= 걸음 수 / 걸은 거리 =============================
function initWalkSection() {
    const walkValueSectionEl = document.querySelector('.walk-value');
    const walkDistanceSectionEl = document.querySelector('.walk-distance');
    
    // *** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = { value : todayUserData.step, distance : todayUserData.distance };

    walkValueSectionEl.innerHTML = `걸음 수 : ${userdata.value} 걸음`;
    walkDistanceSectionEl.innerHTML = `걸은 거리 : ${userdata.distance.toFixed(3)} km`;
}
// ==================================================================

// ============================= 운동 정보 =============================
let videoNum = 0;
function initYoutubeInfo() {
    const infoSectionEl = document.querySelector('.info-section');

    const userCondition = getUserCondition(USER_ID, USER_DATE); // sitting : 0 (이상없음), 1 (오래 앉아있음 2시간 이상 | waist : 0 (이상없음), 1 (허리 증가 2인치 이상)
    
    let status = 0; // status => 0 : 근육 | 1 : 다이어트 | 2 : 스트레칭
    if(userCondition.sitting == 1) {
        status = 2;
    } else if(userCondition.waist == 1) {
        status = 1;
    } else {
        status = 0;
    }

    const statusText = ['근육운동', '다이어트', '스트레칭'];
    const infoText = ['오늘은 근육 운동 어때요?', '허리둘레가 2인치 이상 증가했어요!', '너무 오래 앉아 있으셨네요!' ];

    const info = youtube_info[status];
    const search = youtube_search[status];
    //const randNum = Math.floor(Math.random()*3);
    let videoNum = 1;

    document.querySelector('#item6 > .grid-header').innerHTML = `${info[videoNum].title}`;
    
    //<div class="info-header">${info[randNum].title}</div>
    const innerhtml = `
        <iframe width="400" height="225" src="${info[videoNum].link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <div class="info-text">${infoText[status]}</div>
        <div class="info-search-link" href="${search.link}" target="_blank"> 더 많은 <span style="color: royalblue;">${statusText[status]}</span> 영상은 <a href="${search.link}" target="_blank" style="color:royalblue;">여기</a> 를 클릭</div>
    `;

    infoSectionEl.innerHTML = innerhtml;


    const prevEl = document.querySelector('.info-prev');
    const nextEl = document.querySelector('.info-next');

    prevEl.addEventListener('click', function() {
        if(videoNum == 0) { videoNum = 2; }
        else { videoNum--; }

        document.querySelector('#item6 > .grid-header').innerHTML = `${info[videoNum].title}`;
        const innerhtml = `
            <iframe width="400" height="225" src="${info[videoNum].link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div class="info-text">${infoText[status]}</div>
            <div class="info-search-link" href="${search.link}" target="_blank"> 더 많은 <span style="color: royalblue;">${statusText[status]}</span> 영상은 <a href="${search.link}" target="_blank" style="color:royalblue;">여기</a> 를 클릭</div>
        `;

        infoSectionEl.innerHTML = innerhtml;
    });

    nextEl.addEventListener('click', function() {
        if(videoNum == 2) { videoNum = 0; }
        else { videoNum++; }

        document.querySelector('#item6 > .grid-header').innerHTML = `${info[videoNum].title}`;
        const innerhtml = `
            <iframe width="400" height="225" src="${info[videoNum].link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div class="info-text">${infoText[status]}</div>
            <div class="info-search-link" href="${search.link}" target="_blank"> 더 많은 <span style="color: royalblue;">${statusText[status]}</span> 영상은 <a href="${search.link}" target="_blank" style="color:royalblue;">여기</a> 를 클릭</div>
        `;

        infoSectionEl.innerHTML = innerhtml;
    });
}
// ==================================================================
