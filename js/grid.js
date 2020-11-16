window.addEventListener('DOMContentLoaded', function() {
    Sortable.create(dashGrid, { 
        handle: '.handle',
        swapThreshold: 1,
        animation: 150,
    });

    // ===== 그래프 ===== 
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
            <label for="overeating">과식</label>
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

    const swiper_item5 = new Swiper('.swiper-container.item-5', {
        navigation: {
            nextEl: '.swiper-button-next.item-5',
            prevEl: '.swiper-button-prev.item-5',
        },
    });

    initGraphSection();
    addTimeRateClickEvent();
    addMenuClickEvent();
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
});

// ============================= 그래프 =============================
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

    const dataset = getGraphData(null, 0);

    // 처음 화면에 보여지는 걸음수||허리둘레||과식 별 데이터를 설정
    dataset.forEach(function(d, i) {
        createGraphInfo(d, `menu${i+1}`);
    });
}

function addMenuClickEvent() {
    const menuEl = document.querySelectorAll('.graph-radio-wrapper');
    
    menuEl.forEach(function(el) {
        el.addEventListener('click', function() {
            document.querySelector('.timerate.checked').className = 'timerate';
            document.querySelector('.timerate').className = 'timerate checked';
            document.querySelector('.swiper-pagination-bullet-active').classList.toggle('swiper-pagination-bullet-active');
            el.classList.toggle('swiper-pagination-bullet-active');
            changeGraphTimeRate('rate-day');
        });
    });
}

function addTimeRateClickEvent() {
    const timerateEl = document.querySelectorAll('.timerate');
    
    timerateEl.forEach(function(el) {
        el.addEventListener('click', function() {
            document.querySelector('.timerate.checked').className = 'timerate';
            el.className = 'timerate checked';
            changeGraphTimeRate(el.id);
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

    const dataset = getGraphData(menu, null);

    const svg = document.querySelector(`.d3-graph.${menu}`); 
    while(svg.hasChildNodes()) { 
        svg.removeChild(svg.firstChild);
    }
    createGraphInfo(dataset[timerate], menu);
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
            const value = data[idx];
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

function getGraphData(menu, timerate) { // menu1, menu2, menu3, 0,1,2
    const dataset = {
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
    };

    if(menu == null) { // 각 메뉴마다의 요일별 데이터
        let returnData = [];
        returnData.push(dataset["menu1"][0]);
        returnData.push(dataset["menu2"][0]);
        returnData.push(dataset["menu3"][0]);
        
        return returnData;
    }
    else if(timerate == null) { // 해당 메뉴의 요일별/주간별/월별 데이터
        return dataset[menu];
    }
}
// ==================================================================

// ============================= 랭킹 =============================
function initRankSection() {
    //*** 하단의 데이터를 함수로 받아와야함 ***
    const dataset = [
        [ // 걸음수
            {
                name : '김누구',
                value : 500
            },
            {
                name : '박누구',
                value : 400
            },
            {
                name : '최누구',
                value : 300
            },
            {
                name : '양누구',
                value : 200
            },
            {
                name : '차누구',
                value : 100
            }
        ],
        [ // 허리둘레
            {
                name : '김누구',
                value : 20
            },
            {
                name : '박누구',
                value : 21
            },
            {
                name : '최누구',
                value : 22
            },
            {
                name : '양누구',
                value : 23
            },
            {
                name : '차누구',
                value : 24
            }
        ],
        [ // 과식
            {
                name : '김누구',
                value : 0
            },
            {
                name : '박누구',
                value : 1
            },
            {
                name : '최누구',
                value : 2
            },
            {
                name : '양누구',
                value : 3
            },
            {
                name : '차누구',
                value : 4
            }
        ]
    ];

    const slideEl = document.querySelectorAll('.swiper-slide.item-5');
    slideEl.forEach(function(el, idx) {
        const data = dataset[idx];
        const unit = ['걸음', '인치', '회'];

        let innerText = ``;
        for(let i = 0; i < 5; i++) {
            innerText += `<li><div>${i+1}위</div><div><img src="img/icon/user-icon-black.png">&nbsp;${data[i].name}</div><div>${data[i].value}${unit[idx]}</div></li>`;
        }
        el.innerHTML = `<ul>${innerText}</ul>`;
    });

    //*** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = [
        { // 걸음수의 순위 및 값
            rank : 123,
            value : 30
        },
        { // 허리둘레의 순위 및 값
            rank : 201,
            value : 30
        },
        { // 과식의 순위 및 값
            rank : 13,
            value : 10
        }
    ];
}

function addRankMenuClickEvent() {
    const prevEl = document.querySelector('.swiper-button-prev.item-5');
    const nextEl = document.querySelector('.swiper-button-next.item-5');
    const menuText = ['걸음수', '허리둘레', '과식'];

    prevEl.addEventListener('click', function() {
        let menu;
        if(prevEl.getAttribute('aria-disabled') == 'false' && nextEl.getAttribute('aria-disabled') == 'false') {
            menu = 1; // 걸음수
        } else if(prevEl.getAttribute('aria-disabled') == 'true' && nextEl.getAttribute('aria-disabled') == 'false') {
            menu = 0; // 과식
        } else {
            menu = 2; // 허리둘레
        }
        
        document.querySelector('.swiper-button-menu.item-5').innerHTML = menuText[menu];
    });

    nextEl.addEventListener('click', function() {
        let menu;
        if(prevEl.getAttribute('aria-disabled') == 'false' && nextEl.getAttribute('aria-disabled') == 'false') {
            menu = 1; // 걸음수
        } else if(prevEl.getAttribute('aria-disabled') == 'false' && nextEl.getAttribute('aria-disabled') == 'true') {
            menu = 2; // 과식
        } else {
            menu = 0; // 허리둘레
        }

        document.querySelector('.swiper-button-menu.item-5').innerHTML = menuText[menu];
    });
}
// ==================================================================


// ============================= 칼로리 =============================
function initKcalSection() {
    const kcalSectionEl = document.querySelector('.kcal-section');
    
    // *** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = 1000;

    kcalSectionEl.innerHTML = `${userdata}kcal`;
}
// ==================================================================

// ============================= 과식 =============================
function initOvereatingSection() {
    const overeatingValueEl = document.querySelector('.overeating-value');
    const overeatingNoticeEl = document.querySelectorAll('.overeating-notice');
    // *** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = { value : 3, status : 2}; // status => 0 : 양호 | 1 : 관심 | 2 : 주의

    overeatingValueEl.innerHTML = `${userdata.value}회`;
    overeatingNoticeEl[userdata.status].classList.toggle('active');
}
// ==================================================================

// ============================= 걸음 수 / 걸은 거리 =============================
function initWalkSection() {
    const walkValueSectionEl = document.querySelector('.walk-value');
    const walkDistanceSectionEl = document.querySelector('.walk-distance');
    
    // *** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = { value : 1205, distance : 2.1 };

    walkValueSectionEl.innerHTML = `걸음 수 : ${userdata.value} 걸음`;
    walkDistanceSectionEl.innerHTML = `걸은 거리 : ${userdata.distance} km`;
}
// ==================================================================

// ============================= 운동 정보 =============================
function initYoutubeInfo() {
    const infoSectionEl = document.querySelector('.info-section');
    
    // *** 하단의 데이터를 함수로 받아와야함 ***
    const userdata = { status : 1, text : `이번주 test_ID 님의 허리둘레가 1인치 증가했어요.<br>
    운동을 통해서 체중조절을 해보세요.` }; // status => 0 : 근육 | 1 : 다이어트 | 2 : 스트레칭

    const info = youtube_info[userdata.status];
    const search = youtube_search[userdata.status];
    const randNum = Math.floor(Math.random()*3);

    const innerhtml = `
        <div class="info-header">${info[randNum].title}</div>
        <iframe width="400" height="225" src="${info[randNum].link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <div class="info-text">${userdata.text}</div>
        <a class="info-search-link" href="${search.link}" target="_blank">> 더 많은 동영상 보러가기</a>
    `;

    infoSectionEl.innerHTML = innerhtml;
}
// ==================================================================
