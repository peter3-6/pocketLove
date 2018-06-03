/*
 * 小程序配置文件
 */
// 此处主机域名
// const host = 'http://10.200.11.205/cpuPlus/';
const host = 'https://11376322.koudaiqc.com/cpuPlus/';
const config = {
  // 下面的地址配合项目工作  
  service: {
    host,
    openidUrl: `${host}clientView/user/getOpenId`, //获取用户openid
    createUser: `${host}clientView/user/createUser`, //创建用户
    updateUser: `${host}clientView/user/updateUser`, //修改用户信息
    perfectUser: `${host}clientView/user/perfectUser`, //注册用户信息
    labelList: `${host}clientView/label/labelList`, //标签接口
    createMessage: `${host}clientView/message/createMessage`, //进行留言
    createComplain: `${host}clientView/complain/createComplain`, //提交投诉信息  
    addUserApply: `${host}clientView/userApply/addUserApply`, //报名接口
    getOtherUser: `${host}clientView/macth/getOtherUser`, //获取匹配的用户信息
    submit: `${host}clientView/missioned/submit`, //提交文本任务接口
    selectMessageByOpenId: `${host}clientView/message/selectMessageByOpenId`, //查看留言列表
    selectUserByOpenId: `${host}clientView/user/selectUserByOpenId`, //查看活动前的单个用户信息
    selectUserApplyByOpenId: `${host}clientView/userApply/selectUserApplyByOpenId`, //查看单个用户信息
    selectActivityByFdFlag: `${host}clientView/activity/selectActivityByFdFlag`, //活动信息
    selectManageMessage: `${host}clientView/message/selectManageMessage`,//获取留言列表
    //presentMission: `${host}clientView/mission/presentMission`, //当前任务
    selectMissioned: `${host}clientView/missioned/selectMissioned`, //历史任务
    missionedList: `${host}clientView/missioned/missionedList`, //历史任务（匹配双方只要由一方完成任务，任务就可以进行查看）
    selectMissionedByPage: `${host}clientView/missioned/selectMissionedByPage`, //历史任务（已经完成的任务列表分页）
    selectGift: `${host}clientView/gift/selectGift`, //获取礼物
    picture: `${host}clientView/missioned/picture`, //上传任务图片
    userList: `${host}clientView/user/userList`, //世界排行
    selectUserBySchool: `${host}clientView/user/selectUserBySchool`, //同校排行
    selectMissionedByFdId: `${host}clientView/missioned/selectMissionedByFdId`, //任务详情
    missionCountDown: `${host}clientView/activity/missionCountDown`, // 任务倒计时
    missionList: `${host}clientView/mission/missionList`, //任务列表
    image: `${host}clientView/gift/image`, //获取礼物图列表
    upTaskImg: `${host}clientView/mission/image`, //获取任务图列表
    activityCountDown: `${host}clientView/activity/activityCountDown?flag=1`, //活动倒计时
    applyCountDown: `${host}clientView/activity/activityCountDown?flag=2`, //报名结束倒计时
    maskingCountDown: `${host}clientView/activity/activityCountDown?flag=3`, //查询匹配倒计时
    judge: `${host}clientView/macth/judge`, //查询匹配结果状态
    updateUserApply: `${host}clientView/userApply/updateUserApply`, //查询匹配结果状态
    updateCharismata: `${host}clientView/charismata/updateCharismata`, //魅力值修改
    updateGiftLibrary: `${host}clientView/giftLibrary/updateGiftLibrary`, //礼物数量修改
    givtGift: `${host}clientView/giveGift/givtGift`, //赠送礼物时发送的数据
    selectGiftLibrary: `${host}clientView/giftLibrary/selectGiftLibrary`, //从自己的礼物库获取礼物
    selectGiftLibraryByPage: `${host}clientView/giftLibrary/selectGiftLibraryByPage`, //从自己的礼物库获取礼物(分页显示)
    reviseCharismata: `${host}clientView/charismata/reviseCharismata`, //礼物兑换魅力值
    reviseGiftLibrary: `${host}clientView/giftLibrary/reviseGiftLibrary`,//礼物兑换魅力值
    missionedImage: `${host}clientView/missioned/image`, //已完成任务的图片
    readMessage: `${host}clientView/remind/readMessage`, ///代表是第几天完成任务系统通知送礼物；消息中心
    messageList: `${host}clientView/remind/messageList`, //收到留言消息时，显示收到留言提示列表
    missionTime: `${host}clientView/activity/missionTime`, // 开始任务时间
    // activityTime: `${host}clientView/activity/activityTime?flag=1`, //活动开始时间
    // applyTime: `${host}clientView/activity/activityTime?flag=2`, //报名结束时间
    // maskingTime: `${host}clientView/activity/activityTime?flag=3`, //查询匹配时间
    getActivityEndTime: `${host}clientView/activity/activityCountDown?flag=4`, //活动结束倒计时
    controlMessage: `${host}clientView/activity/controlMessage`, //判断是否可以留言
    addTemplateMessage: `${host}clientView/templateMessage/addTemplateMessage`, //报名的时候提交的formId
    addTemplateMessage2: `${host}clientView/templateMessage/addTemplateMessage2`, //给对方发送模板消息
    addTemplateMessage3: `${host}clientView/templateMessage/addTemplateMessage3`, //Tomorrow task模板消息 up formId
    sendApplyTemplate: `${host}clientView/templateMessage/sendApplyTemplate`, //获取(发送模板消息的接口)
    sendMissionTemplate: `${host}clientView/templateMessage/sendMissionTemplate`, //发送完成模板消息的接口 //
  }
};
module.exports = config;