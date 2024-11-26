// 現在年度から学年を計算
const CalclateGrade = entered =>{
    const date = new Date();
    
    // 4月(month: 3)を超えているなら学年を足す
    return date.getFullYear() - entered +
        (date.getMonth() < 3 ? 0:1);
}

const GetMemberList = async () =>{
    const RequestURL = './data/members.json';

    const response = await fetch(RequestURL);
    const json = response.json();

    json.catch(error=>console.error(error));

    return json;
}

// メンバー表のjsonからHTML要素を生成
const GenerateMemberListHTML = json =>{
    const name = json['name'];
    const grade = CalclateGrade(json['entered']);
    const faculty = json['faculty'];
    const belonging = json['belonging'];
    const sns = json['sns'];
    
    let result = `
        <p>ニックネーム: ${name}</p>\n
        <p>学年　　　　: ${(grade <= 4 ? grade:`院${grade - 4}`)}回生</p>\n
        <p>学部学科　　: ${faculty}</p>\n
    `;

    if(0 < belonging.length){
        result += '<p>所属クラブ</p>\n<ul>\n';
        for(const clubName of belonging){
            result += `\t<li><p>${clubName}</p></li>\n`
        }
        result += '</ul>\n';
    }
    
    if(0 < sns.length){
        result += '<p>SNS</p>\n<ul>\n';

        for(const obj of sns){
            if(obj['type'] === 'twitter'){
                result += `
                    \t<li>\n
                    \t\t<p>Twitter: <a href="https://twitter.com/${obj['name']}/" target="_blank" rel="noopener noreferrer">@${obj['name']}</a>\n
                    \t\t\t<!-- Twitter フォローボタン用 -->\n
                    \t\t\t<a href="https://twitter.com/${obj['name']}?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @${obj['name']}</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n
                    \t\t</p>\n
                    \t</li>
                `
            }
        }

        result += '</ul>\n';
    }

    return result;
}


const SetMemberListNode = async () =>{
    const baseNode = document.querySelector('section#member-list');

    const memberList = await GetMemberList();
    
    // 代表
    const leadersElem = baseNode.querySelector('section#leaders');
    leadersElem.insertAdjacentHTML('beforeend', '<ul></ul>');

    for(const leader of memberList['leaders']){
        const leaderListElem = leadersElem.querySelector('ul');
        leaderListElem.insertAdjacentHTML('beforeend', `
            <li>\n
            \t${GenerateMemberListHTML(leader)}\n
            </li>
        `);
    }

    // 副代表
    const subleadersElem = baseNode.querySelector('section#subleaders');
    subleadersElem.insertAdjacentHTML('beforeend', '<ul></ul>');

    for(const subleader of memberList['subleaders']){
        const subleaderListElem = subleadersElem.querySelector('ul');
        subleaderListElem.insertAdjacentHTML('beforeend', `
            <li>\n
            \t${GenerateMemberListHTML(subleader)}\n
            </li>
        `);
    }

    // 会計
    const accountantsElem = baseNode.querySelector('section#accountants');
    accountantsElem.insertAdjacentHTML('beforeend', '<ul></ul>');

    for(const accountant of memberList['accountants']){
        const accountantsListElem = accountantsElem.querySelector('ul');
        accountantsListElem.insertAdjacentHTML('beforeend', `
            <li>\n
            \t${GenerateMemberListHTML(accountant)}\n
            <li>
        `);
    }

    // 普通の部員
    const membersElem = baseNode.querySelector('section#members');
    membersElem.insertAdjacentHTML('beforeend', '<ul></ul>');

    for(const member of memberList['members']){
        const membersListElem = membersElem.querySelector('ul');
        membersListElem.insertAdjacentHTML('beforeend', `
            <li>\n
            \t${GenerateMemberListHTML(member)}\n
            </li>
        `);
    }
}

document.addEventListener('DOMContentLoaded', SetMemberListNode(), null);