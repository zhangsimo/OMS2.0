<style lang="less">
  @import './login.less';
  @import './register.less';

</style>

<template>
  <div class="login flex" @keydown.enter="handleSubmit">
    <div class="login-left">
      <span>
        <img src="../../../assets/images/logo.png"/>
        <em>不·卖·假·件</em>
      </span>
      <strong class="login-left-tip">
        科技<i>·</i>互联<i>·</i>效率
      </strong>
    </div>
    <div class="login-right">
<!--      <p class="login-right-top"><a href="javascript:void(0)" @click="addFavorite">加入收藏</a>-->
<!--      </p>-->
      <div class="login-con">
        <h3 class="login-con-header">极配正品</h3>
        <div class="form-con">
          <p class="title">欢迎注册</p>
          <p class="login-con-tit">
            <slot></slot>
          </p>
          <div class="form-con-inner">
            <Form ref="registerForm" :model="form" :rules="rules" inline>
              <FormItem prop="companyName" style="margin-bottom: 20px">
                <Input style="width: 300px" size="large" v-model="form.companyName" placeholder="请输入公司名称">

                </Input>
              </FormItem>
              <FormItem prop="mobile" style="margin-bottom: 20px">
                <Input style="width: 300px" size="large" v-model="form.mobile"  placeholder="手机号码">

                </Input>
              </FormItem>
               <FormItem  style="margin-bottom: 20px">
                <Input style="width: 140px" size="large" v-model="form.username"  placeholder="请输入验证码"></Input>
                <div class="fr ml10"> <a href="javascript:void(0)" @click="getCo"><span style="color: white!important;cursor: pointer;">{{getCodeBtnText}}</span></a> </div>
              </FormItem>
               <FormItem prop="username" style="margin-bottom: 20px">
                <Select  clearable style="width:300px" size="large" v-model="modell">
                  <Option v-for="item in type" :value="item.dictCode" :key="item.dictCode">{{ item.dictName }}</Option>
                </Select>
              </FormItem>
              <Row>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="flex zzzz">
                  <FormItem prop="province">
                    <Select v-model="formValidate.province" placeholder="请选择省份" style="width: 142px;height: 38px;" class="mr5 plh">
                      <Option v-for="item in provinceArr" v-if="item.parentId==0" :key="item.id" :value="item.id" >{{ item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem prop="city">
                    <Select v-model="formValidate.city" placeholder="请选择城市" style="width: 142px;height: 38px!important;" class="mr10">
                      <Option v-for="item in provinceArr" v-if="formValidate.province==item.parentId" :key="item.id" :value="item.id" >{{ item.name}}</Option>
                    </Select>
                  </FormItem>
                </Form>
              </Row>
                <div class="flex mt15">
                  <div style="color: #7c1c1a">
                  注册即同意
                  </div>
                  <div class="ml20">
                    <a href="javascript:void(0)" @click="showPolicy"><span style="color: white!important;cursor: pointer;">隐私政策/用户协议</span></a>
                  </div>

                </div>
              <FormItem>
                <Button style="width: 300px" @click="registerA" :disabled="canRegister" size="large" :loading="loading" class="login-con-submit mt10" long>注册</Button>
              </FormItem>
              <div class="flex">
                    <div class="ml5" style="color: #7c1c1a">已有账号?</div>
                    <div class="ml20">
                      <a href="javascript:void(0)" @click="goLogin" ><span style="color: white!important;cursor: pointer;font-size: 16px">登录</span></a>
                    </div>
                  </div>

            </Form>
          </div>
        </div>
        <p class="login-right-tip">不卖假件<i>·</i>不用假件</p>
      </div>
    </div>
    <Modal v-model="showP" title="用户注册协议和隐私政策" width="500px">
      <section class="model-content">
        <div class="modal-box">
          <p class="content-title">隐私政策</p>
          <div class="content">
            <p class="title">提示条款</p>
            <p class="val">
              极配OMS服务提供者（或简称“我们”）将按法律法规要求，采取相应安全保护措施，尽力保护用户的个人信息安全可控,我们制定本《法律声明及隐私权政策》（下称“本政策 /本隐私权政策”）并提醒用户：
              本政策适用于极配OMS产品或服务 需要特别说明的是，本政策不适用于其他第三方向用户提供的服务，也不适用于极配OMS中已另行独立设置法律声明及隐私权政策的产品或服务。在使用极配OMS各项产品或服务前，请用户务必仔细阅读并透彻理解本政策，在确认充分理解并同意后使用相关产品或服务。一旦用户开始使用极配OMS各项产品或服务，即表示用户已充分理解并同意本政策。 如对本政策内容有任何疑问、意见或建议，用户可通过极配OMS提供的各种联系方式（http://oms.g-part.cn）与我们联系。</p>
          </div>
          <div class="content">
            <p class="title">第一部分 定义</p>
            <div class="tip-list">
              <span class="name">极配OMS:</span>
              <span>指极配OMS（域名为oms.g-part.cn）网站及极配OMS客户端。</span>
            </div>
            <div class="tip-list">
              <span class="name">极配OMS服务提供者:</span>
              <span>指极配OMS的网络及软件技术服务提供者上海佳配汽车零部件有限公司。个人信息：指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。</span>
            </div>
            <div class="tip-list">
              <span class="name">个人敏感信息:</span>
              <span>指包括身份证件号码、个人生物识别信息、银行账号、财产信息、行踪轨迹、交易信息、14岁以下（含）儿童信息等的个人信息（我们将在本隐私权政策中对具体个人敏感信息以粗体进行显著标识）。 </span>
            </div>
            <div class="tip-list">
              <span class="name">个人信息删除:</span>
              <span>指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。 </span>
            </div>
            <div class="tip-list">
              <span>除另有约定外，本政策所用定义与《极配OMS服务协议》中的定义具有相同的含义。</span>
            </div>
          </div>
          <div class="content">
            <p class="title">第二部分 法律声明</p>
            <div class="tip-title">
              <p class="name">一、权利归属</p>
              <p class="val">除非极配OMS另行声明，极配OMS内的所有产品、技术、软件、程序、数据及其他信息（包括文字、图标、图片、照片、音频、视频、图表、色彩组合、版面设计等）的所有权利（包括版权、商标权、专利权、商业秘密及其他相关权利）均归极配OMS服务提供者及/或其关联公司所有。未经极配OMS服务提供者及/或其关联公司许可，任何人不得以包括通过机器人、蜘蛛等程序或设备监视、复制、传播、展示、镜像、上载、下载等方式擅自使用极配OMS内的任何内容。
                极配OMS的“极配OMS”、“oms.g-part.cn”等文字及/或标识，以及极配OMS的其他标识、徽记、产品和服务名称均为极配OMS服务提供者及/或其关联公司在中国和其他国家的商标，如有宣传、展示等任何使用需要，用户必须取得极配OMS服务提供者及/或其关联公司事先书面授权。 </p>
            </div>
            <div class="tip-title">
              <p class="name">二、知识产权保护</p>
              <p class="val">我们尊重知识产权，反对并打击侵犯知识产权的行为。知识产权权利人若认为极配OMS内容侵犯其合法权益的，可以通过极配OMS进行投诉，我们将在收到知识产权权利人合格通知后依据相应的法律法规以及平台规则及时处理。</p>
            </div>
          </div>
          <div class="content">
            <p class="title">第三部分 隐私权政策</p>
            <p>本隐私权政策部分将帮助用户了解以下内容：</p>
            <p>1.我们如何收集和使用用户的个人信息 </p>
            <p>2.我们如何使用 Cookie 和同类技术</p>
            <p>3.我们如何共享、转让、公开披露用户的个人信息</p>
            <p>4.我们如何保护用户的个人信息</p>
            <p>5.用户如何管理用户的个人信息</p>
            <p>6.我们如何处理未成年人的个人信息</p>
            <p>7.用户的个人信息如何在全球范围转移</p>
            <p>8.本隐私权政策如何更新</p>
            <p>9.如何联系我们</p>
            <div class="tip-title">
              <p class="name">一、我们如何收集和使用用户的信息</p>
              <p >在用户使用我们的产品及/或服务时，我们需要/可能需要收集和使用的用户的个人信息包括如下两种：</p>
              <p >1.为实现向用户提供我们产品及/或服务的基本功能，用户须授权我们收集、使用的必要的信息。如用户拒绝提供相应信息，用户将无法正常使用我们的产品及/或服务；</p>
              <p >2.为实现向用户提供我们产品及/或服务的附加功能，用户可选择授权我们收集、使用的信息。如用户拒绝提供，用户将无法正常使用相关附加功能或无法达到我们拟达到的功能效果，但并不会影响用户正常使用我们产品及/或服务的基本功能。
                用户理解并同意.为给用户带来更好的产品和服务体验，我们在持续努力改进我们的技术，随之我们可能会不时推出新的或优化后的功能，可能需要收集、使用新的个人信息或变更个人信息使用目的或方式。对此，我们将通过更新本政策、弹窗、页面提示等方式另行向用户说明对应信息的收集目的、范围及使用方式，并为用户提供自主选择同意的方式，且在征得用户明示同意后收集、使用。
                在此过程中，如果用户有任何疑问、意见或建议的，用户可通过极配OMS提供的各种联系方式与我们联系，我们会尽快为用户作出解答。
                我们会出于本政策所述的以下目的，收集和使用用户的个人信息：</p>
              <p>(一)帮助用户成为我们的用户</p>
              <p>为成为我们的用户，以便我们为用户提供用户服务，用户需要提供手机号码、公司名称、验证码、公司地址和创建密码。如果用户仅需使用浏览等基本服务，用户不需要注册成为我们的用户及提供上述信息。</p>
              <p>(二)向用户提供商品或服务</p>
              <p>1.我们在用户使用服务过程中收集的信息</p>
              <p>为向用户提供更契合用户需求的页面展示和搜索结果、了解产品适配性、识别账号异常状态，我们会收集关于用户使用的服务以及使用方式的信息并将这些信息进行关联，这些信息包括：
                设备信息：我们会根据用户在软件安装及使用中授予的具体权限，接收并记录用户所使用的设备相关信息（例如设备型号、操作系统版本、设备设置、唯一设备标识符等软硬件特征信息）、设备所在位置相关信息（例如IP 地址、GPS位置以及能够提供相关信息的WLAN接入点、蓝牙和基站等传感器信息）。
                日志信息：当用户使用我们的网站或客户端提供的产品或服务时，我们会自动收集用户对我们服务的详细使用情况，作为有关网络日志保存。例如用户的搜索查询内容、IP地址、浏览器的类型、电信运营商、使用的语言、访问日期和时间及用户访问的网页记录等。
                请注意，单独的设备信息、日志信息等是无法识别特定自然人身份的信息。如果我们将这类非个人信息与其他信息结合用于识别特定自然人身份，或者将其与个人信息结合使用，则在结合使用期间，这类非个人信息将被视为个人信息，除取得用户授权或法律法规另有规定外，我们会将该类个人信息做匿名化、去标识化处理。
                为展示用户账号的订单信息，我们会收集用户在使用我们服务过程中产生的订单信息用于用户对订单进行管理。
                当用户与我们联系时，我们可能会保存用户的通信/通话记录和内容或用户留下的联系方式等信息，以便与用户联系或帮助用户解决问题，或记录相关问题的处理方案及结果。</p>
              <p>（三）为用户提供安全保障</p>
              <p>为提高用户使用我们服务的安全性，保护用户或其他用户或公众的人身财产安全免遭侵害，更好地预防钓鱼网站、欺诈、网络漏洞、计算机病毒、网络攻击、网络侵入等安全风险，更准确地识别违反法律法规或极配OMS相关协议规则的情况， 我们可能使用或整合用户的用户信息、交易信息、设备信息、有关网络日志取得用户授权或依据法律共享的信息，来综合判断用户账户及使用风险、进行身份验证、检测及防范安全事件，并依法采取必要的记录、审计、分析、处置措施。</p>
              <p>（四）其他用途</p>
              <p>我们将信息用于本政策未载明的其他用途，或者将基于特定目的收集而来的信息用于其他目的时，会事先征求用户的同意。</p>
              <p>（五）征得授权同意的例外</p>
              <p>根据相关法律法规规定，以下情形中收集用户的个人信息无需征得用户的授权同意： </p>
              <p>1.与国家安全、国防安全有关的；</p>
                <p>2.与公共安全、公共卫生、重大公共利益有关的；</p>
                <p>3.与犯罪侦查、起诉、审判和判决执行等有关的；</p>
                <p>4.出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到用户本人同意的；</p>
                <p>5.所收集的个人信息是用户自行向社会公众公开的；</p>
                <p>6.从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；</p>
                <p>7.根据用户的要求签订合同所必需的；</p>
                <p>8.用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；</p>
                <p>9.为合法的新闻报道所必需的；</p>
                <p>10.学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；</p>
                <p>11.法律法规规定的其他情形。如我们停止运营极配OMS产品或服务，我们将及时停止继续收集用户个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知用户，对所持有的个人信息进行删除或匿名化处理。</p>
              <p class="name">二、我们如何使用 Cookie 和同类技术</p>
              <p>（一）Cookie</p>
              <p>为确保网站正常运转、为用户获得更轻松的访问体验、向用户推荐用户可能感兴趣的内容，我们会在用户的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie 通常包含标识符、站点名称以及一些号码和字符。
                用户可根据自己的偏好管理或删除Cookie。用户可以清除计算机上保存的所有 Cookie，大部分网络浏览器都设有阻止 Cookie 的功能。但如果用户这么做，则需要在每一次访问我们的网站时更改用户设置。如需详细了解如何更改浏览器设置，请访问用户使用的浏览器的相关设置页面。 </p>
              <p>（二）网站信标和像素标签</p>
              <p>除 Cookie 外，我们还会在网站上使用网站信标和像素标签等其他同类技术。例如，我们向用户发送的电子邮件可能含有链接至我们网站内容的地址链接，如果用户点击该链接，我们则会跟踪此次点击，帮助我们了解用户的产品或服务偏好以便于我们主动改善客户服务体验。网站信标通常是一种嵌入到网站或电子邮件中的透明图像。借助于电子邮件中的像素标签，我们能够获知电子邮件是否被打开。如果用户不希望自己的活动以这种方式被追踪，则可以随时从我们的寄信名单中退订。</p>
              <p class="name">三、我们如何共享、转让、公开披露用户的个人信息</p>
              <p>（一）转让 </p>
              <p>我们不会将用户的个人信息、公司信息转让给任何公司、组织和个人，但以下情况除外：</p>
              <p>1.在获取明确同意的情况下转让：获得用户的明确同意后，我们会向其他方转让用户的个人信息；</p>
              <p>2.在极配OMS服务提供者发生合并、收购或破产清算情形，或其他涉及合并、收购或破产清算情形时，如涉及到个人信息转让，我们会要求新的持有用户个人信息的公司、组织继续受本政策的约束，否则我们将要求该公司、组织和个人重新向用户征求授权同意。</p>
              <p>（二）公开披露 </p>
              <p>我们仅会在以下情况下，公开披露用户的个人信息：</p>
              <p>1.获得用户明确同意或基于用户的主动选择，我们可能会公开披露用户的个人信息；</p>
              <p>2.如果我们确定用户出现违反法律法规或严重违反极配OMS相关协议规则的情况，或为保护极配OMS及其关联公司用户或公众的人身财产安全免遭侵害，我们可能依据法律法规或极配OMS相关协议规则征得用户同意的情况下披露关于用户的个人信息，包括相关违规行为以及极配OMS已对用户采取的措施。</p>
              <p>（三）共享、转让、公开披露个人信息时事先征得授权同意的例外 </p>
              <p>以下情形中，共享、转让、公开披露用户的个人信息无需事先征得用户的授权同意：</p>
              <p>1.与国家安全、国防安全有关的； </p>
              <p>2.与公共安全、公共卫生、重大公共利益有关的； </p>
              <p>3.与犯罪侦查、起诉、审判和判决执行等有关的；</p>
              <p>4.出于维护用户或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</p>
              <p>5.用户自行向社会公众公开的个人信息；</p>
              <p>6.从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
                根据法律规定，共享、转让经去标识化处理的个人信息，且确保数据接收方无法复原并重新识别个人信息主体的，不属于个人信息的对外共享、转让及公开披露行为，对此类数据的保存及处理将无需另行向用户通知并征得用户的同意。</p>

            </div>
          </div>
          <div class="content">
            <p class="title">四、用户的个人信息如何在全球范围转移</p>
            <p>我们在中华人民共和国境内运营中收集和产生的个人信息，存储在中国境内，以下情形除外： </p>
            <p>1.法律法规有明确规定；</p>
            <p>2.获得用户的明确授权；</p>
            <p>3.用户通过互联网进行跨境交易等个人主动行为。</p>
            <p>针对以上情形，我们会确保依据本隐私权政策对用户的个人信息提供足够的保护。</p>
          </div>
          <div class="content">
            <p class="title">五、本隐私权政策如何更新</p>
            <p>我们的隐私权政策可能变更。
              未经用户明确同意，我们不会限制用户按照本隐私权政策所应享有的权利。我们会在专门页面上发布对隐私权政策所做的任何变更。
              对于重大变更，我们还会提供更为显著的通知（包括我们会通过极配OMS公示的方式进行通知甚至向用户提供弹窗提示） </p>
            <p>本政策所指的重大变更包括但不限于：</p>
            <p>1.我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；</p>
            <p>2.我们在控制权等方面发生重大变化。如并购重组等引起的所有者变更等；</p>
            <p>3.个人信息共享、转让或公开披露的主要对象发生变化；</p>
            <p>4.用户参与个人信息处理方面的权利及其行使方式发生重大变化；</p>
            <p>5.我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；</p>
            <p>6.个人信息安全影响评估报告表明存在高风险时。我们还会将本隐私权政策的旧版本在极配OMS专门页面存档，供用户查阅。</p>
          </div>
          <div class="content">
            <p>用户可以通过以下方式与我们联系，我们将在15天内回复用户的请求：</p>
            <p>1.官方网址：http://oms.g-part.cn</p>
            <p>2.官方邮箱：</p>
            <p>3.客服热线：</p>
            <p>4.联系地址：上海市闵行区虹梅南路3833号8号楼。</p>
          </div>
        </div>
        <div class="modal-box">
          <p class="content-title">用户注册协议</p>
          <div>
            <p>在注册使用极配订单管理系统（以下简称“极配OMS”）前，请注册用户务必充分阅读并理解《服务协议》（以下简称“本协议”）的所有条款。特别是免除或者限制责任的条款、争议解决和法律适用条款。如注册用户对协议有任何疑问的，应向极配OMS客服咨询。</p>
            <p>当注册用户按照注册页面提示填写信息、阅读并同意本协议且勾选注册页面下方的“我已阅读并同意《服务协议》”选项等全部注册程序后，即表示注册用户已充分阅读、理解并接受本协议的全部内容，并与极配OMS达成协议。注册 用户承诺接受并遵守本协议的约定，并不得以未阅读本协议的内容或者未获得极配OMS对注册用户问询的解答等理由，主张本协议无效，或要求撤销本协议。</p>
          </div>
          <div class="content">
            <p class="title">一、定义</p>
            <p class="val">
              极配订单管理系统：指极配订单管理系统（以下简称“OMS”）指域名为oms.g-part.cn网站及其客户端软件、应用程序。
              极配订单管理系统服务提供者：指极配OMS的网络及软件技术服务提供者上海佳配汽车零部件有限公司。
              极配订单管理系统网站列明的各项规则。
            </p>
            <p class="title">二、用户的权利义务：</p>
            <p class="val">
              1、在完成“极配OMS”注册程序后您将成为“极配OMS”合法用户，享受“极配OMS”提供的服务，同时用户需保证具有相应的民事行为能力，并在完全同意本协议的情形下完成注册。
            </p>
            <p>
              2、用户在本网站注册成功后需对帐号及密码的使用及安全承担全部责任。用户不得将帐号转借他人使用，用户应对以其帐号进行的所有活动承担责任。
            </p>
            <p>
              3、用户应对使用“极配OMS”的一切行为承担责任，如因用户行为给其他第三方或“极配OMS”造成任何损失的，用户应承担赔偿责任。
            </p>
            <p>
              4、用户在“极配OMS”实施了违法行为，导致第三方投诉（包括但不限于第三方以发函等形式指控“极配OMS”侵权，提起诉讼、仲裁，或使“极配OMS”面临相关主管 机关的审查或质询），“极配OMS”有权先暂停用户的使用。用户应在收到通知后，以自己名义出面与第三方协商、应诉或接受相关主管机关审查或质询，承担所有费用，并赔偿“极配OMS”造成的全部损失。
            </p>
            <p class="title">三、“极配OMS”的权利义务：</p>
            <p>1、“极配OMS”应为用户提供优质的服务，并接受用户的监督及合理建议。</p>
            <p>
              2、 用户同意因网络原因、“极配OMS”进行网络调整、正常的系统维护升级等造成的本网站无法正常访问，“极配OMS”不承担任何责任。
            </p>
            <p>
              3、“极配OMS”网站（包括但不限于网站上的所有工具、应用、功能等）作为“极配OMS”为用户提供使用服务的平台，用户同意并保证不得侵犯任何第三方的权益。“极配OMS”对用户的使用行为不承担任何责任。
            </p>
            <p>
              4、“极配OMS”可能会提供与其他互联网网站或资源进行链接。对于前述网站或资源是否可以利用，“极配OMS”不予担保。因使用或依赖上述网站或资源所造成的损失或损害，“极配OMS”也不负担任何责任。
            </p>
            <p class="title">四、知识产权：</p>
            <div>
              极配OMS上所有内容，包括但不限于著作、图片、档案、资讯、资料、平台架构、平台画面的安排、网页设计，均由极配OMS或其他权利人依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等。
              非经极配OMS或其他权利人书面同意，任何人不得擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表极配OMS程序或内容。
            </div>
            <p class="title">五、违约责任：</p>
            <p>如用户有以下行为视为违约，“极配OMS”有权随时采取停止服务，删除信息，取消会员资格，解除本协议，要求用户赔偿一切损失等行动。同时“极配OMS”已收取的服务费（如有）将不予退还。</p>
            <p>
              1、用户的行为违反法律规定的。
            </p>
            <p>
              2、用户的行为违反本协议承诺、约定的。
            </p>
            <p>
              3、用户的行为侵犯任何第三方权益的。
            </p>
            <p>
              3、用户的行为侵犯任何第三方权益的。
            </p>
            <p class="title">
              六、注册用户的守法义务及承诺
            </p>
            <p>
              1、注册用户承诺绝不为任何非法目的或以任何非法方式使用极配OMS服务，并承诺遵守中国相关法律、法规及一切使用互联网之国际惯例，遵守所有与极配OMS服务有关的网络协议、规则和程序。
            </p>
            <p>
              2、注册用户同意并保证不得利用极配OMS服务从事侵害他人权益或违法之行为，若有违反者应负所有法律责任。上述行为包括但不限于：<br/>
              （1）违反宪法所确定的基本原则，危害国家安全、泄漏国家秘密、颠覆国家政权、破坏国家统一的。<br/>
              （2）侵害他人名誉、隐私权、商业秘密、商标权、著作权、专利权、其他知识产权及其他权益。<br/>
              （3）违反依法律或合约所应负之保密义务。<br/>
              （4）冒用他人名义使用极配OMS服务。<br/>
              （5）从事任何不法交易行为，如贩卖枪支、毒品、禁药、盗版软件或其他违禁物。<br/>
              （6）提供赌博资讯或以任何方式引诱他人参与赌博。<br/>
              （7）涉嫌洗钱、套现或进行传销活动的。<br/>
              （8）从事任何可能含有电脑病毒或是可能侵害极配OMS服务系統、资料等行为。<br/>
              （9）利用极配OMS服务系统进行可能对互联网或移动网正常运转造成不利影响之行为。<br/>
              （10）侵犯极配OMS的商业利益，包括但不限于发布非经极配OMS许可的商业广告。<br/>
              （11）利用极配OMS服务上传、展示或传播虚假的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料。<br/>
              （12）其他极配OMS有正当理由认为不适当之行为。<br/>
            </p>
            <p>
              3、极配OMS保有依其单独判断删除极配OMS内各类不符合法律政策或不真实或不适当的信息内容而无须通知注册用户的权利，并无需承担任何责任。若注册用户未遵守以上规定的，极配OMS有权作出独立判断并采取暂停或关闭注册用户账户等措施，而无需承担任何责任。
            </p>
            <p>
              4、注册用户同意，由于注册用户违反本协议，或违反通过援引并入本协议并成为本协议一部分的文件，或由于注册用户使用极配OMS服务违反了任何法律或第三方的权利而造成任何第三方进行或发起的任何补偿申请或要求（包括律师费用），注册用户会对极配OMS及其关联方、合作伙伴、董事以及雇员给予全额补偿并使之不受损害。
            </p>
            <p>
              5、注册用户承诺，其通过极配OMS上传或发布的信息均真实有效，其向极配OMS提交的任何资料均真实、有效、完整、详细、准确。如因违背上述承诺，造成极配OMS或极配OMS其他使用方损失的，注册用户对极配OMS或极配OMS其他使用方承担赔偿责任。
            </p>
            <div>
              <p class="title">七、服务中断或故障</p>
              注册用户同意，基于互联网的特殊性，极配OMS不担保服务不会中断。系统因相关状况无法正常运作，使注册用户无法使用任何极配OMS服务或使用任何极配OMS服务时受到任何影响时，极配OMS对注册用户或第三方不负任何责任，前述状况包括但不限于：<br>
              （1）极配OMS系统停机维护期间。<br>
              （2）电信设备出现故障不能进行数据传输的。<br>
              （3）由于黑客攻击、网络供应商技术调整或故障、网站升级、银行方面的问题等原因而造成的极配OMS服务中断或延迟。<br>
              （4）因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成极配OMS系统障碍不能执行业务的。<br>
              <p class="title">八、责任范围及限制</p>
              1、极配OMS未对任何极配OMS服务提供任何形式的保证，包括但不限于以下事项：<br>
              （1）极配OMS服务将符合注册用户的需求。<br>
              （2）极配OMS服务将不受干扰、及时提供或免于出错。<br>
              （3）注册用户经由极配OMS服务购买或取得之任何产品、服务、资讯或其他资料将符合注册用户的期望。<br>
              2、极配OMS的内容可能涉及由第三方所有、控制或运者营的其他网站（以下简称“第三方网站”），极配OMS不能保证也没有义务保证第三方网站上任何信息的真实性和有效性。注册用户确认按照第三方网站的服务协议使用第三方网站，而不是按照本协议。注册用户经由极配OMS服务的使用下载或取得任何资料，应由注册用户自行考量且自负风险，因资料的下载而导致的任何损失由注册用户自行承担。<br>
              3、注册用户自极配OMS及极配OMS工作人员或经由极配OMS服务取得的建议或资讯，无论其为书面或口头，均不构成极配OMS对极配OMS服务的任何保证。<br>
              4、极配OMS不保证为向注册用户提供便利而设置的外部链接的准确性、有效性、安全性和完整性，但保证不提供钓鱼网站、病毒网站。同时，对于该等外部链接指向的不由极配OMS实际控制的任何网页上的内容，极配OMS不承担任何责任。<br>
              5、在法律允许的情况下，极配OMS对于与本协议有关或由本协议引起的，或者由于使用极配OMS、或由于其所包含的或以其它方式通过极配OMS提供给注册用户的全部信息、内容、材料、产品（包括软件）和服务、或购买和使用产品引起的任何间接的、惩罚性的、特殊的、派生的损失（包括但不限于业务损失、收益损失、利润损失、使用数据或其他经济利益的损失），不论是如何产生的，也不论是由对本协议的违约（包括违反保证）还是由侵权造成的，均不负有任何责任，即使其事先已被告知此等损失的可能性。另外，即使本协议规定的排他性救济没有达到其基本目的，也应排除极配OMS对上述损失的责任。
              <p class="title">九、隐私权保护及授权条款</p>
              1、极配OMS对于注册用户提供的、极配OMS自行收集的、经认证的个人信息将按照本协议予以保护、使用或者披露。 极配OMS无需注册用户同意即可向第三方授权主体转让与极配OMS有关的全部或部分权利和义务。未经极配OMS事先书面同意，注册用户不得转让其在本协议项下的任何权利和义务。<br>
              2、极配OMS可能自公开及私人资料来源处收集注册用户的额外资料，以更好地掌握注册用户情况，并为注册用户度身定制极配OMS服务、解决争议并有助确保在极配OMS进行安全交易。<br>
              3、极配OMS按照注册用户在极配OMS上的行为自动追踪关于注册用户的某些资料。在不透露注册用户的隐私资料的前提下，极配OMS有权对整个注册用户数据库进行分析并对注册用户数据库进行商业上的利用。<br>
              4、注册用户同意极配OMS可使用关于注册用户的相关资料（包括但不限于极配OMS持有的有关注册用户的档案中的资料，极配OMS从注册用户目前及以前在极配OMS上的活动所获取的其他资料以及极配OMS通过其他方式自行收集的资料）以解决争议、对纠纷进行调停。注册用户同意极配OMS可通过人工或自动程序对注册用户的资料进行评价。<br>
              5、极配OMS采用行业标准惯例以保护注册用户的资料。注册用户因履行本协议提供给极配OMS的信息，极配OMS不会恶意出售或免费共享给任何第三方，以下情况除外：<br>
              （1）提供独立服务且仅要求服务相关的必要信息的供应商，如印刷厂、邮递公司等；<br>
              （2）具有合法调阅信息权限并从合法渠道调阅信息的政府部门或其他机构，如公安机关、法院；<br>
              （3）极配OMS的关联实体；<br>
              （4）经平台使用方或平台使用方授权代表同意的第三方。<br>
              6、注册用户提供给极配OMS信息可用于极配OMS及因服务必要而委托的第三方为注册用户提供服务及推荐产品，法律禁止的除外。极配OMS及其委托的第三方对上述信息负有保密义务。<br>
              7、极配OMS有义务根据有关法律要求向司法机关和政府部门提供注册用户的个人资料。在注册用户未能按照与极配OMS签订的服务协议或者与极配OMS其他注册用户签订的协议等其他法律文本的约定履行自己应尽的义务时，极配OMS有权根据自己的判断，或者与该笔交易有关的其他注册用户的请求披露注册用户的个人信息和资料，并做出评论。注册用户严重违反极配OMS的相关规则的，极配OMS有权对注册用户提供的及极配OMS自行收集的注册用户的个人信息和资料编辑入网站黑名单，并将该黑名单对第三方披露，且极配OMS有权将注册用户提交或极配OMS自行收集的注册用户的个人资料和信息与任何第三方进行数据共享，以便平台和第三方催收欠款及对注册用户的其他申请进行审核之用，由此可能造成的注册用户的任何损失，极配OMS不承担法律责任。<br>
              <p class="title">十、税务处理</p>
              注册用户在享有极配OMS提供的服务时产生的一切相关税费，由注册用户向其主管税务机关申报、缴纳，极配OMS不负责处理相关事宜。<br>
              <p class="title">十一、条款的解释、法律适用及争端解决</p>
              本协议是由注册用户与极配OMS共同签订的，适用于注册用户在极配OMS的全部活动。本协议内容包括但不限于协议正文条款及已经发布的或将来可能发布的各类规则，所有条款和规则为协议不可分割的一部分，与协议正文具有同等法律效力。
              本协议不涉及注册用户与极配OMS的其他注册用户之间，因网上交易而产生的法律关系及法律纠纷。但注册用户在此同意将全面接受并履行与极配OMS其他注册用户在极配OMS签订的任何电子法律文本，并承诺按照该法律文本享有和（或）放弃相应的权利、承担和（或）豁免相应的义务。
              本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，则应认为该条款可与本协议相分割，并可被尽可能接近各方意图的、能够保留本协议要求的经济目的的、有效的新条款所取代，而且，在此情况下，本协议的其他条款仍然完全有效并具有约束力。
              本协议及其修订的有效性、履行与本协议及其修订效力有关的所有事宜，将受中国法律管辖，任何争议仅适用中国法律。
              本协议签订地为中国杭州市西湖区。因本协议所引起的注册用户与极配OMS的任何纠纷或争议，首先应友好协商解决，协商不成的，注册用户在此完全同意将纠纷或争议提交极配OMS所在地有管辖权的人民法院诉讼解决。
              极配OMS对本服务协议拥有最终的解释权。
              <p class="title">十二、协议的变更：</p>
              “极配OMS”保留随时修正、更新本服务条款的权利。一旦发生相关修订或更新，“极配OMS”会将修订和更新的内容及时在本页面发布，用户如认为变更无法接受，应该停止使用本网站相关服务。如果继续使用“极配OMS”相关服务的，则视为用户接受变更条款并愿意受其约束。
              <p class="title">十三、不可抗力：</p>
              如因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力导致本协议无法履行的，双方互不承担责任。
              <p class="title">十四、法律适用：</p>
              本协议的订立、生效、解释、执行、管辖、争议的解决均适用中华人民共和国法律。
              <p class="title">十五、其他：</p>
              1、本协议自用户登录使用“极配OMS”起生效，长期有效。<br>
              2、“极配OMS”保留在法律允许范围内对本协议的最终解释权。<br>
            </div>
          </div>
        </div>

      </section>
<!--      <p style="text-align: center;margin: 10px 0;">-->
<!--        <Radio-group :model.sync="isAgree">-->
<!--          <Radio value="1">同意</Radio>-->
<!--          <Radio value="2">不同意</Radio>-->
<!--        </Radio-group>-->
<!--      </p>-->
    </Modal>
  </div>
</template>

<script>
  import { sendMessage , findByDynamicQuery ,findByDictCode ,register} from '../../../api/lease/registerLogin'
  // import { getCode } from './register'
  // import SlideValidate from './slide-validate'
  import Message from '_c/message'

  export default {
    name: 'gpart-login-page',
    components: {},
    data () {
      const validatePhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else if (!/^\d{3}-\d{8}|\d{4}-\{7,8}$/.test(value)) {
                callback(new Error('手机号格式不正确'));
            } else {
                callback();
            }
        };
      return {
        formValidate: {},//省份城市
        provinceArr: [],//省市
        ruleValidate:{},
        //公司类型下拉框数组
        company:[],
        //省下拉框
        province :[],
        //市下拉框
        city:[],
        getCodeBtnText:'获取验证码',
          timerBack:60,
          cansend:true,
        form: {
          companyName: '',
          mobile: '',
        },
         rules: {
                companyName: [
                    {required: true, message: '公司名称不能为空', trigger: ['blur','change']}
                ],
                mobile: [
                    { required: true,validator:validatePhone,trigger:['blur', 'change']}
                ],
                code: [
                    { required: true,trigger:['blur', 'change']}
                ]
            },
        single:false,
        loading:false,
        type: [],//类型
        modell:'', //下拉框
          canRegister:false,
          showP:false,//政策弹窗
          isAgree:1,
      }
    },
    methods: {
      //获取验证码
      getCo() {
        let tel = {}
        tel.mobile =this.form.mobile;
          if(this.cansend){
              this.timerBack=60;
              this.getCodeBtnText = `${this.timerBack}后重新获取验证码`;
              this.cansend=false;
              sendMessage(tel).then(res => {
                  if(res.code==0){
                      let timer = setInterval(()=>{
                          this.timerBack --
                          this.getCodeBtnText = `${this.timerBack}后重新获取验证码`
                          if(this.timerBack==0){
                              clearInterval(timer)
                              this.timerBack = 60;
                              this.getCodeBtnText = '获取验证码';
                              this.cansend=true;
                          }
                      },1000)
                  }else{
                      this.timerBack = 60;
                      this.getCodeBtnText = '获取验证码';
                      this.cansend=true;
                  }
              })
          }

      },
      //已有账号去登录
      goLogin() {
        this.$router.push("/login")
      },
      register() {
        this.$router.push("/register")
      },
      handleSubmit () {
        this.form.username = this.form.username.trim()
        this.loading = true
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            let username = this.form.username
            let password = this.form.password
            this.$emit('on-commit', {username, password, errCallback: this.errCallback})
          } else {
            this.loading = false
          }
        })
      },
      errCallback() {
        this.loading = false
      },
      addFavorite() {
        var url = window.location;
        var title = document.title;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie 8") > -1) {
          external.AddToFavoritesBar(url, title, '');//IE8
        } else {
          try {
            window.external.addFavorite(url, title);
          } catch (e) {
            try {
              window.sidebar.addPanel(title, url, "");//firefox
            } catch (e) {
              alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
          }
        }
      },
      setHome() {
        const obj = this
        const vrl = window.location
        try {
          obj.style.behavior = 'url(#default#homepage)';
          obj.setHomePage(vrl);
        }
        catch (e) {
          if (window.netscape) {
            try {
              netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
              alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', vrl);
          }
        }
      },
      // 省份城市
      citya(){
        let params = {}
        findByDynamicQuery(params).then(res => {
          // console.log(res)
          if(res.code === 0){
            this.provinceArr = res.data
          }
        })
      },
      //数据字典
      findBy(){
        findByDictCode().then(res => {
          if(res.code === 0){
            this.type = res.data
            // console.log(this.type)
          }
        })
      },
      //注册
      registerA(){
        let formData = new FormData();
        formData.append('companyName', this.form.companyName);
        formData.append('mobile', this.form.mobile);
        formData.append('code', this.form.username);
        formData.append('type', this.modell);
        formData.append('provinceId', this.formValidate.province);
        formData.append('cityId', this.formValidate.city);

        // console.log(formData);
        register(formData).then(res => {
            if(res.code === 0){
              this.$Message.success('注册成功')
             this.$router.push("/login")
            }
        })
      },
        //展示用户政策
        showPolicy(){
          this.showP=true;
        }
    },
    mounted(){
      this.citya()
      this.findBy()
    }
  }
</script>

<style scoped>
  .zzzz >>> .ivu-select-single .ivu-select-selection{
    height: 38px!important;
  }
  .zzzz >>> .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    height: 38px!important;
    line-height: 38px;
  }
  .zzzz >>> .ivu-form-item{
    margin-bottom: 0!important;
  }
</style>
<style scoped lang="less">
  .model-content{
    height: 500px;
    padding: 0 20px;
    overflow-y:auto ;
    .content-title{
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-weight: 700;
    }
    .title{
      color:#333;
      font-size:14px;
      font-weight: 700;
      text-align: left;
      margin-bottom: 20px;
    }
    .content{
      margin-bottom: 20px;
    }
  }
</style>
