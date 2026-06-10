// ========================================================================
// AEO认证稽核系统 v2.0 — 官方认证标准数据
// ========================================================================
// 数据来源：海关总署公告2026年第34号 附件2/4/5
// 高级认证企业标准：74项（通用标准68项 + 附加标准6项）
// 认证企业标准：62项（通用标准56项 + 附加标准6项）
// 结构：维度 → 子分类 → 标准项
// ========================================================================

var FULL_STANDARDS = {
  // ======================================================================
  // 高级认证企业标准 — 通用标准 + 附加标准（共74项）
  // ======================================================================
  advanced: {
    // ─── 一、内部控制标准（11项）──────────────────────────────────────
    internal: {
      title: '内部控制',
      icon: 'sitemap',
      color: 'blue',
      subcategories: [
          {
            name: '1. 关企合作',
            items: [
            {
                id: 'IC-01',
                officialId: '(1)',
                name: '关企合作-海关联系人',
                desc: '指定海关业务联系人并通过平台沟通',
                dept: '关务部',
                supportDept: '总经办',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关业务联系人任命文件+平台沟通记录',
                standard: '指定海关业务联系人，通过"中国海关信用管理服务平台"等方式与海关开展沟通与合作。企业相关人员在其他企业担任法定代表人（主要负责人）或者财务负责人的，须及时将有关情况告知海关。',
                checkFile: '海关业务联系人任命文件、关企沟通记录、企业相关人员在其他企业任职告知记录',
                checkInterview: '海关业务联系人姓名/职务/联系方式；关企沟通渠道和方式；相关人员在其他企业任职的告知情况',
                checkSite: '',
                checkRandom: '关企沟通的书面或系统记录',
                sampleDocs: [
                '海关业务联系人任命文件',
                '关企沟通记录表',
                '任职告知书'
              ],
                checkPoints: [
                '是否指定海关业务联系人并保持畅通联系',
                '其他企业任职情况是否书面告知海关',
                '关企沟通是否有记录'
              ]
              },
            {
                id: 'IC-02',
                officialId: '(2)',
                name: '关企合作-高管管控',
                desc: '法定代表人/关务负责人掌握进出口总体情况',
                dept: '总经办',
                supportDept: '关务部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '高管了解业务情况相关记录',
                standard: '法定代表人（主要负责人）或者负责关务的高级管理人员（关务负责人）应当掌握企业涉及海关业务的总体情况，包括进出口业务、遵守海关监管规定、信用状况等，有效管控企业发生的进出口不规范情形、违法情事等。',
                checkFile: '',
                checkInterview: '法定代表人或关务负责人是否了解企业进出口业务总体情况；是否了解海关监管要求；如何处理进出口不规范情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '关务汇报材料',
                '进出口业务汇报记录'
              ],
                checkPoints: [
                '法定代表人/关务负责人是否掌握进出口业务总体情况',
                '是否了解企业海关信用状况',
                '对不规范情形是否有效管控'
              ]
              },
            {
                id: 'IC-03',
                officialId: '(3)',
                name: '关企合作-岗位能力',
                desc: '关务及进出口人员熟悉业务及海关要求',
                dept: '关务部',
                supportDept: 'HR',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '岗位培训及考核记录',
                standard: '关务人员、所属报关人员以及进出口相关岗位人员应当熟悉本岗位相关的进出口业务以及海关管理要求，及时处置进出口不规范情形、违法情事等并有效整改。',
                checkFile: '',
                checkInterview: '关务人员是否了解本岗位进出口业务流程和海关要求；遇到不规范情形如何处置和整改',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '岗位说明书',
                '业务操作手册'
              ],
                checkPoints: [
                '关务人员是否熟悉进出口业务流程',
                '是否了解海关管理要求',
                '不规范情形处置是否及时有效'
              ]
              },
            {
                id: 'IC-04',
                officialId: '(4)',
                name: '关企合作-配合海关',
                desc: '积极配合海关稽查、调查、核查等工作',
                dept: '关务部',
                supportDept: '法务部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '配合海关工作的相关记录',
                standard: '积极配合或者协助海关办理相关案件的侦查、调查，以及开展稽查、贸易调查、核查等相关工作，并提供涉及相关案件、情事的数据或者资料。',
                checkFile: '',
                checkInterview: '过去配合海关稽查/调查/核查的情况；提供资料是否及时完整',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '海关稽查配合记录',
                '海关核查提供资料清单'
              ],
                checkPoints: [
                '是否积极配合海关稽查/调查/核查',
                '按要求提供的数据资料是否完整及时'
              ]
              }
          ]
          },
          {
            name: '2. 单证复核',
            items: [
            {
                id: 'IC-05',
                officialId: '(5)',
                name: '单证复核',
                desc: '申报前内部复核单证真实完整性',
                dept: '关务部',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '复核制度+复核记录+异常处置记录',
                standard: '明确制单、复核岗位工作流程和审核指引，在申报前或者委托申报前有专门部门或者岗位人员对申报内容和进出口单证的真实性、完整性、准确性和规范性进行内部复核。',
                checkFile: '单证复核制度（含岗位职责/工作流程/异常处置）',
                checkInterview: '制单/复核岗位设置和人员配备情况；复核工作落实情况；发现问题如何处置',
                checkSite: '实际制单和复核操作流程演示',
                checkRandom: '复核工作记录（需有制单/复核人员签字）',
                sampleDocs: [
                '进出口业务管理制度',
                '复核签字记录',
                '系统复核截图'
              ],
                checkPoints: [
                '是否明确制单/复核岗位分工',
                '申报前是否进行内部复核',
                '复核是否覆盖真实性/完整性/准确性/规范性'
              ]
              }
          ]
          },
          {
            name: '3. 单证保管',
            items: [
            {
                id: 'IC-06',
                officialId: '(6)',
                name: '单证保管',
                desc: '进出口单证按规定归档保管',
                dept: '关务部',
                supportDept: '行政部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '保管制度+归档记录+保管场所',
                standard: '明确进出口单证、相关记录的归档工作流程和保管要求，按照法律、行政法规、海关总署规章、海关总署公告等相关规定建立并妥善保存海关要求保管的账簿、单证、记录等有关资料以及与进出口直接相关的其他资料和海关核发的证书、法律文书等。',
                checkFile: '进出口单证归档管理制度（含归档时限/保管要求/档案保管）',
                checkInterview: '归档管理部门/岗位/人员；归档流程和保管期限；保管场所和安全性',
                checkSite: '档案保管场所（纸质/电子），查看防火/防水/防盗设施',
                checkRandom: '',
                sampleDocs: [
                '进出口单证归档管理制度',
                '档案保管清单',
                '保管场所照片'
              ],
                checkPoints: [
                '归档流程是否明确',
                '保管期限是否符合海关要求',
                '保管场所是否安全'
              ]
              }
          ]
          },
          {
            name: '4. 禁限审查',
            items: [
            {
                id: 'IC-07',
                officialId: '(7)',
                name: '禁限审查',
                desc: '专门岗位审查货物禁止/限制性规定',
                dept: '关务部',
                supportDept: '法务部',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '审查制度+审查记录+处置记录',
                standard: '有专门部门或者岗位人员根据国家对进出境货物、物品有关禁止性管理或者限制性管理规定，对进出境货物、物品情况进行审查，明确审查流程和处置要求。',
                checkFile: '禁限审查制度（含责任部门/岗位/审查流程/处置要求）',
                checkInterview: '负责禁限审查的部门/岗位/人员；审查流程和执行情况',
                checkSite: '禁限审查实际操作演示',
                checkRandom: '禁限审查记录（含审查结论及处置情况）',
                sampleDocs: [
                '禁止/限制进出境物品管理规定',
                '禁限审查操作手册',
                '禁限审查记录表'
              ],
                checkPoints: [
                '是否有专门部门/岗位负责禁限审查',
                '审查流程是否明确',
                '审查结果是否记录存档'
              ]
              }
          ]
          },
          {
            name: '5. 信息系统',
            items: [
            {
                id: 'IC-08',
                officialId: '(8)',
                name: '信息系统',
                desc: '建立信息管理系统，实现流程跟踪可追溯',
                dept: 'IT部',
                supportDept: '关务部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '系统手册+系统截图+穿行测试+数据保存证明',
                standard: '建立真实、准确、完整并有效管理企业生产经营、进出口活动、财务等的信息系统，对生产、采购、销售、物流运输、出入库、报关、税款缴纳、收付汇等主要环节实现流程检索、跟踪，涉及的货物流、单证流、信息流能够相互印证。系统数据自进出口货物办结海关手续之日起保存3年以上。企业的ERP系统或跨境电商平台已与海关对接且满足海关管理要求的，海关不再对本项标准进行认证，视为达标。',
                checkFile: '信息系统使用手册（含功能模块/数据流向）',
                checkInterview: '系统名称/上线时间/功能模块；是否覆盖生产经营全过程；信息流是否实现自动比对和追溯',
                checkSite: '登录系统演示——选取进出口单据验证货物流/单证流/信息流',
                checkRandom: '',
                sampleDocs: [
                '信息系统使用手册',
                '系统全流程截图',
                'ERP与海关对接证明'
              ],
                checkPoints: [
                '系统是否覆盖生产经营主要环节',
                '货物流/单证流/信息流能否相互印证',
                '系统数据是否保存3年以上',
                'ERP对接海关可视为达标'
              ]
              },
            {
                id: 'IC-09',
                officialId: '(9)',
                name: '信息安全',
                desc: '数据安全管理制度，防入侵防泄露',
                dept: 'IT部',
                supportDept: '总经办',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '信息安全制度+防火墙/密码措施+备份记录',
                standard: '建立并执行数据安全、信息安全管理制度，使用防火墙、密码等措施保护信息系统免受未经授权的访问，定期执行数据备份，防止信息丢失，采取措施防范内部恶意信息窃取、数据篡改等情形。企业取得ISO27001信息安全管理体系认证结果，或者经具备《网络安全等级保护测评机构推荐证书》资质的机构测评，企业《网络安全等级保护测评报告》年度等级测评结论为"符合"的，海关不再对本项标准进行认证，视为达标。',
                checkFile: '信息安全管理制度的书面文件',
                checkInterview: '信息安全管理部门/岗位/人员；保障数据安全的具体措施；系统非正常运行及处置情况',
                checkSite: '信息安全措施演示：密码使用/防火墙/机房安全',
                checkRandom: '信息安全事故/系统故障的应急处置记录、责任追究记录',
                sampleDocs: [
                '信息安全管理制度',
                '数据备份管理制度',
                '机房物理设施',
                'ISO27001认证证书'
              ],
                checkPoints: [
                '是否使用防火墙/密码等安全措施',
                '是否定期执行数据备份',
                '是否防范内部恶意信息窃取/篡改',
                'ISO27001认证或等保测评达标可免认证'
              ]
              }
          ]
          },
          {
            name: '6. 内部审计和改进',
            items: [
            {
                id: 'IC-10',
                officialId: '(10)',
                name: '内部审计',
                desc: '每年对进出口守法规范情况进行内部审计',
                dept: '内审部',
                supportDept: '关务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '审计制度+审计计划+审计底稿+审计报告',
                standard: '申请成为高级认证企业的，企业对上一审计年度的进出口守法、规范情况进行内部审计，并向海关提交内部审计报告；成立不满1年的，提交自成立以来的内部审计报告。已经成为高级认证企业的，企业每年对上一审计年度的进出口守法、规范情况以及持续符合高级认证企业标准开展内部审计，并形成专门档案，按照海关要求或者在海关复核时提交。',
                checkFile: '内部审计制度、审计计划、审计底稿、审计报告',
                checkInterview: '审计部门/人员/人数/职责；每年审计方案/次数/时间；审计业务范围；发现的问题及改进情况',
                checkSite: '内部审计档案材料（方案/计划/团队分工/底稿/报告）',
                checkRandom: '',
                sampleDocs: [
                '内部审计制度',
                '审计计划',
                '审计底稿',
                '审计报告'
              ],
                checkPoints: [
                '是否每年对进出口守法规范进行内部审计',
                '审计是否形成专门档案',
                '审计报告是否按要求提交海关',
                '持续符合高级认证标准是否有专项审计'
              ]
              },
            {
                id: 'IC-11',
                officialId: '(11)',
                name: '改进机制',
                desc: '法定代表人组织开展问题处置和改进',
                dept: '总经办',
                supportDept: '关务部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '问题处置记录+改进方案+实施跟踪',
                standard: '企业存在的未按规定报送企业信用信息年度报告、海关责令或者要求规范整改事项、违法情事、内部审计发现的涉及进出口业务问题，应当由法定代表人（主要负责人）或者负责关务的高级管理人员组织开展处置和改进。',
                checkFile: '问题处置和改进的书面文件',
                checkInterview: '法定代表人/关务负责人如何组织开展问题处置和改进',
                checkSite: '',
                checkRandom: '问题处置和改进的工作记录',
                sampleDocs: [
                '改进报告',
                '问题处置记录',
                '整改跟踪表'
              ],
                checkPoints: [
                '问题是否由法定代表人/关务负责人组织处置',
                '内部审计发现的问题是否有效改进',
                '海关责令整改事项是否按时完成'
              ]
              }
          ]
          }
      ]
    },

    // ─── 二、财务状况标准（4项）─────────────────────────────────────────
    finance: {
      title: '财务状况',
      icon: 'chart-line',
      color: 'emerald',
      subcategories: [
          {
            name: '7. 财务状况',
            items: [
            {
                id: 'FI-01',
                officialId: '(12)',
                name: '财务状况-审计报告',
                desc: '审计报告无保留意见，按时报送',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '会计师事务所审计报告',
                standard: '会计师事务所审计报告所反映的企业财务状况真实、完整、规范、合法。申请成为高级认证企业的，提交当年会计师事务所出具的上年度审计报告；成立不满1年的，提交自成立以来的审计报告。在海关备案的分支机构提供记载有本分支机构财务信息的会计师事务所审计报告。自成为高级认证企业起每年6月30日前，按照海关要求报送上年度审计报告有关事项。审计报告为无保留意见的，达标；审计报告为保留意见的，基本达标；审计报告为否定意见或者无法表示意见的，不达标。',
                checkFile: '会计师事务所审计报告、审计报告报送记录',
                checkInterview: '审计报告意见类型；是否按时报送海关',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '审计报告样本',
                '审计报告报送回执'
              ],
                checkPoints: [
                '审计报告是否无保留意见',
                '每年6月30日前是否按要求报送',
                '分支机构是否单独报送'
              ]
              },
            {
                id: 'FI-02',
                officialId: '(13)',
                name: '财务状况-偿债能力',
                desc: '资产负债率、现金比率等4项偿债指标',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '财务报表数据分析+偿债能力指标计算表',
                standard: '具有一定的偿债能力。①资产负债率（总负债/总资产×100%）≤85%（生产型），资产负债率（总负债/总资产×100%）≤75%（非生产型）；②现金比率【（货币资金+交易性金融资产）/流动负债】≥0.2；③经营现金流负债比（经营活动产生的现金流量净额/总负债）≥0.1；④流动比率（流动资产/流动负债）≥1.0。上述4项指标的计算采用审计报告中的财务报表数据。2项及以上符合要求的，为达标；仅1项符合要求的，为基本达标；每项都不符合要求的，为不达标。',
                checkFile: '财务报表数据、偿债能力指标计算表',
                checkInterview: '资产负债率/现金比率/经营现金流负债比/流动比率四项指标实际数值',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '财务计算公式样本',
                '行业财务指标评价标准值'
              ],
                checkPoints: [
                '资产负债率是否达标（生产型≤85%/非生产型≤75%）',
                '现金比率是否≥0.2',
                '经营现金流负债比是否≥0.1',
                '流动比率是否≥1.0'
              ]
              },
            {
                id: 'FI-03',
                officialId: '(14)',
                name: '财务状况-盈利能力',
                desc: '净利润、营业利润率等5项盈利指标',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '财务报表数据分析+盈利能力指标计算表',
                standard: '具有一定的盈利能力。①净利润＞0；②营业利润率（营业利润/营业收入×100%）≥1%，且营业利润＞0；③毛利率【（营业收入-营业成本）/营业收入×100%】≥1%；④经营性现金流净额＞0；⑤总资产报酬率【（利润总额+利息费用）/平均总资产×100%】≥1%。上述5项指标的计算采用审计报告中的财务报表数据。2项及以上符合要求的，为达标；仅1项符合要求的，为基本达标；每项都不符合要求的，为不达标。',
                checkFile: '财务报表数据、盈利能力指标计算表',
                checkInterview: '净利润/营业利润率/毛利率/经营性现金流净额/总资产报酬率五项指标实际数值',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '财务指标计算表',
                '利润表',
                '现金流量表'
              ],
                checkPoints: [
                '净利润是否＞0',
                '营业利润率是否≥1%且营业利润＞0',
                '毛利率是否≥1%',
                '经营性现金流净额是否＞0',
                '总资产报酬率是否≥1%'
              ]
              },
            {
                id: 'FI-04',
                officialId: '(15)',
                name: '财务状况-破产退出',
                desc: '无进入解散程序或被宣告破产',
                dept: '财务部',
                supportDept: '总经办',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业状态说明',
                standard: '进入解散程序或者被依法宣告破产的，视为不达标。',
                checkFile: '',
                checkInterview: '企业当前是否存在解散或破产情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '企业状态自我声明'
              ],
                checkPoints: [
                '是否存在进入解散程序情形',
                '是否被依法宣告破产'
              ]
              }
          ]
          }
      ]
    },

    // ─── 三、守法规范标准（28项）───────────────────────────────────────
    compliance: {
      title: '守法规范',
      icon: 'balance-scale',
      color: 'violet',
      subcategories: [
          {
            name: '8. 注册备案信息',
            items: [
            {
                id: 'LC-01',
                officialId: '(16)',
                name: '注册备案信息',
                desc: '海关注册信息与实际相符，2年内无未办理变更',
                dept: '关务部',
                supportDept: '总经办',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关注册登记信息核对记录',
                standard: '企业在海关注册登记或者备案信息与实际相符，2年内无未按规定办理海关变更手续的情形。',
                checkFile: '海关注册登记信息表、企业实际信息核对表',
                checkInterview: '海关注册登记信息是否与实际一致；最近变更是否及时办理',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '海关注册登记证书',
                '企业信息变更记录'
              ],
                checkPoints: [
                '注册信息与实际是否相符',
                '2年内是否有未按规定办理变更的情形'
              ]
              }
          ]
          },
          {
            name: '9. 遵守法律法规',
            items: [
            {
                id: 'LC-02',
                officialId: '(17)',
                name: '遵守法律法规-刑事犯罪',
                desc: '企业相关人员2年内无故意犯罪刑事处罚',
                dept: 'HR',
                supportDept: '法务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '无犯罪记录证明+自我申明',
                standard: '企业相关人员2年内未因故意犯罪被刑事处罚。',
                checkFile: '无犯罪记录证明、企业自我申明',
                checkInterview: '企业相关人员是否有刑事犯罪记录',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '无犯罪记录证明',
                '企业自我申明'
              ],
                checkPoints: [
                '企业相关人员2年内是否因故意犯罪被刑事处罚'
              ]
              },
            {
                id: 'LC-03',
                officialId: '(18)',
                name: '遵守法律法规-单次处罚',
                desc: '1年内单次处罚≤5万元或未超进出口总值万分之一',
                dept: '关务部',
                supportDept: '法务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关处罚情况说明',
                standard: '1年内无被海关单次行政处罚金额超过5万元的行为，但单次处罚金额未超过上年度进出口总值万分之一的除外。（上年度进出口总值无法计算的，不考虑比值）',
                checkFile: '行政处罚记录',
                checkInterview: '1年内是否有海关行政处罚；处罚金额是否超标',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '海关行政处罚记录查询结果'
              ],
                checkPoints: [
                '1年内单次行政处罚金额是否超过5万元',
                '如超过是否未超过进出口总值万分之一'
              ]
              },
            {
                id: 'LC-04',
                officialId: '(19)',
                name: '遵守法律法规-处罚次数',
                desc: '1年内处罚次数≤3次且金额累计≤10万元',
                dept: '关务部',
                supportDept: '法务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '行政处罚统计表',
                standard: '1年内被海关行政处罚次数不超过3次或者违法次数不超过上年度报关相关单证总票数千分之一，且被海关行政处罚金额累计不超过10万元。（上年度报关相关单证票数无法计算的，不考虑比值）',
                checkFile: '行政处罚统计表',
                checkInterview: '1年内行政处罚次数和金额累计情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '行政处罚清单',
                '报关单票数统计'
              ],
                checkPoints: [
                '行政处罚次数是否≤3次',
                '或违法次数是否≤总票数千分之一',
                '累计处罚金额是否≤10万元'
              ]
              },
            {
                id: 'LC-05',
                officialId: '(20)',
                name: '遵守法律法规-进出口固废/管制',
                desc: '2年内无固废/出口管制违法处罚',
                dept: '关务部',
                supportDept: '法务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '行政处罚查询记录',
                standard: '2年内无因违反国家对进口固体废物、出口管制相关禁止性或者限制性管理规定被海关行政处罚的情形。',
                checkFile: '行政处罚查询记录',
                checkInterview: '2年内是否有进口固废或出口管制违规处罚',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '海关处罚记录查询结果'
              ],
                checkPoints: [
                '2年内是否有进口固体废物违规处罚',
                '2年内是否有出口管制违规处罚'
              ]
              }
          ]
          },
          {
            name: '10. 业务开展',
            items: [
            {
                id: 'LC-06',
                officialId: '(21)',
                name: '业务开展',
                desc: '1年内有进出口活动',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '进出口报关单统计',
                standard: '1年内有进出口活动或者开展的进出口业务与海关直接相关。',
                checkFile: '进出口报关单统计表',
                checkInterview: '1年内是否有进出口活动或与海关直接相关的业务',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '进出口报关单汇总',
                '进出口业务情况说明'
              ],
                checkPoints: [
                '1年内是否有进出口活动',
                '或开展的进出口业务是否与海关直接相关'
              ]
              }
          ]
          },
          {
            name: '11. 款项缴纳',
            items: [
            {
                id: 'LC-07',
                officialId: '(22)',
                name: '款项缴纳',
                desc: '2年内无超期未缴纳税款/罚款/违法所得',
                dept: '财务部',
                supportDept: '关务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '税款缴纳记录',
                standard: '2年内无超过法定期限未缴纳海关要求缴纳的税款（包括滞纳金）、罚款、没收的违法所得的情形（海关同意延期缴纳的除外）。',
                checkFile: '税款缴费凭证、海关罚款缴纳凭证',
                checkInterview: '2年内是否存在超期未缴纳税款或罚款的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '税款缴纳凭证',
                '罚款缴纳凭证'
              ],
                checkPoints: [
                '2年内是否超期未缴纳税款',
                '2年内是否超期未缴纳罚款',
                '2年内是否超期未缴纳没收违法所得'
              ]
              }
          ]
          },
          {
            name: '12. 申报规范',
            items: [
            {
                id: 'LC-08',
                officialId: '(23)',
                name: '申报规范',
                desc: '报关单查获率不超过规定标准',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '报关单查获统计分析',
                standard: '1年内海关检查企业自理申报的报关单票数在50票以下的，报关单查获票数不超过5票且高质量查获报关单票数不超过1票；1年内海关检查企业自理申报的报关单票数超过50票的，报关单查获率不超过10%且高质量查获率不超过2%。',
                checkFile: '报关单自查统计表、查获记录',
                checkInterview: '1年内报关单查获票数及查获率；高质量查获情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '报关单查获记录',
                '报关单票数统计'
              ],
                checkPoints: [
                '自查申报票数50票以下：查获≤5票且高质量≤1票',
                '50票以上：查获率≤10%且高质量率≤2%'
              ]
              }
          ]
          },
          {
            name: '13. 税款要求',
            items: [
            {
                id: 'LC-09',
                officialId: '(24)',
                name: '税款要求',
                desc: '1年内追征税款≤10万元或次数不超过规定',
                dept: '财务部',
                supportDept: '关务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '追征税款记录',
                standard: '1年内累计追征税款金额不超过10万元，或者1年内被追征税款超过10万元的情形不超过1次且累计追征税款金额不超过企业上年度总纳税额的千分之一。',
                checkFile: '追征税款情况统计',
                checkInterview: '1年内追征税款金额和次数',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '海关追税决定书',
                '税款缴纳记录'
              ],
                checkPoints: [
                '追征税款金额是否≤10万元',
                '或超过10万元次数≤1次且累计≤总纳税额千分之一'
              ]
              }
          ]
          },
          {
            name: '14. 委托要求',
            items: [
            {
                id: 'LC-10',
                officialId: '(25)',
                name: '委托要求-委托报关',
                desc: '2年内未委托失信企业报关',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '报关企业信用核查记录',
                standard: '2年内未委托信用等级为失信企业或者严重失信企业的报关企业办理海关业务。',
                checkFile: '报关企业信用等级核查记录',
                checkInterview: '2年内委托的报关企业信用等级是否均为非失信企业',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '报关企业信用等级查询记录',
                '委托报关协议'
              ],
                checkPoints: [
                '2年内是否委托失信/严重失信报关企业办理业务'
              ]
              },
            {
                id: 'LC-11',
                officialId: '(26)',
                name: '委托要求-接受委托',
                desc: '2年内未接受失信企业委托',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '客户信用核查记录',
                standard: '2年内未接受信用等级为失信企业或者严重失信企业的生产销售单位或者消费使用单位委托办理海关业务。',
                checkFile: '委托企业信用等级核查记录',
                checkInterview: '2年内接受委托的客户企业信用等级情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '客户信用等级查询记录'
              ],
                checkPoints: [
                '2年内是否接受失信/严重失信企业委托办理业务'
              ]
              }
          ]
          },
          {
            name: '15. 管理要求',
            items: [
            {
                id: 'LC-12',
                officialId: '(27)',
                name: '管理要求-异常名录',
                desc: '2年内未被列入海关信用信息异常企业名录',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '信用信息查询记录',
                standard: '2年内海关未发现企业被列入海关信用信息异常企业名录。',
                checkFile: '海关信用信息查询记录',
                checkInterview: '企业是否被列入海关信用信息异常企业名录',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '信用信息查询结果'
              ],
                checkPoints: [
                '2年内是否被列入异常企业名录'
              ]
              },
            {
                id: 'LC-13',
                officialId: '(28)',
                name: '管理要求-虚增贸易',
                desc: '2年内无虚增贸易被海关统计处置',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关统计处置记录',
                standard: '2年内海关未发现企业因涉嫌虚增贸易等原因被海关统计处置的情形。',
                checkFile: '',
                checkInterview: '企业是否存在因虚增贸易被海关统计处置的情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '2年内是否因虚增贸易被海关统计处置'
              ]
              },
            {
                id: 'LC-14',
                officialId: '(29)',
                name: '管理要求-提供虚假情况',
                desc: '2年内未向海关提供虚假情况或隐瞒事实',
                dept: '关务部',
                supportDept: '法务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '2年内海关未发现企业向海关提供虚假情况或者隐瞒事实。',
                checkFile: '',
                checkInterview: '企业是否向海关提供虚假情况或隐瞒事实',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '企业诚信承诺书'
              ],
                checkPoints: [
                '2年内是否向海关提供虚假情况或隐瞒事实'
              ]
              },
            {
                id: 'LC-15',
                officialId: '(30)',
                name: '管理要求-抗拒执法',
                desc: '2年内无抗拒阻碍海关执法',
                dept: '关务部',
                supportDept: '法务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '2年内海关未发现企业抗拒、阻碍海关工作人员依法执行职务。',
                checkFile: '',
                checkInterview: '企业是否存在抗拒阻碍海关执法的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '企业承诺书'
              ],
                checkPoints: [
                '2年内是否抗拒阻碍海关执法'
              ]
              },
            {
                id: 'LC-16',
                officialId: '(31)',
                name: '管理要求-毁弃资料',
                desc: '2年内无转移隐匿篡改毁弃账簿单证',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '2年内海关未发现企业转移、隐匿、篡改、毁弃账簿、报关单证以及与进出口直接相关的资料。',
                checkFile: '',
                checkInterview: '企业是否存在转移隐匿篡改毁弃相关资料的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '企业承诺书'
              ],
                checkPoints: [
                '2年内是否转移隐匿篡改毁弃账簿单证'
              ]
              },
            {
                id: 'LC-17',
                officialId: '(32)',
                name: '管理要求-拒绝提供资料',
                desc: '2年内无拒绝拖延向海关提供资料',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '2年内海关未发现企业拒绝、拖延向海关提供账簿、报关单证以及与进出口直接相关的资料。',
                checkFile: '',
                checkInterview: '企业是否存在拒绝拖延向海关提供资料的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '企业承诺书'
              ],
                checkPoints: [
                '2年内是否拒绝拖延向海关提供资料'
              ]
              },
            {
                id: 'LC-18',
                officialId: '(33)',
                name: '管理要求-责令改正',
                desc: '2年内无被海关责令限期改正未按要求改正',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关责令改正通知及整改记录',
                standard: '2年内海关未发现企业被海关责令限期改正，但未按海关要求改正。',
                checkFile: '',
                checkInterview: '企业是否存在被海关责令改正但未按要求改正的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '海关责令改正通知书',
                '整改完成报告'
              ],
                checkPoints: [
                '2年内是否被海关责令改正但未按要求改正'
              ]
              },
            {
                id: 'LC-19',
                officialId: '(34)',
                name: '管理要求-检疫处理义务',
                desc: '2年内无不履行检疫处理等义务',
                dept: '关务部',
                supportDept: '质检部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '检疫处理履行记录',
                standard: '2年内海关未发现企业被海关责令或者要求履行检疫处理、技术整改、退运、销毁、采取风险消减措施等义务，但未按要求履行。',
                checkFile: '',
                checkInterview: '企业是否存在被要求检疫处理/技术整改等义务但未按要求履行的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '检疫处理履行记录',
                '整改完成说明'
              ],
                checkPoints: [
                '2年内是否被要求但未履行检疫处理/技术整改等义务'
              ]
              },
            {
                id: 'LC-20',
                officialId: '(35)',
                name: '管理要求-书面承诺',
                desc: '2年内无书面承诺未如实履行',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '书面承诺及履行记录',
                standard: '2年内海关未发现企业向海关作出书面承诺，但未如实履行。',
                checkFile: '',
                checkInterview: '企业是否存在书面承诺未如实履行的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '2年内是否书面承诺未如实履行'
              ]
              },
            {
                id: 'LC-21',
                officialId: '(36)',
                name: '管理要求-禁止行贿',
                desc: '2年内无向海关人员行贿',
                dept: '总经办',
                supportDept: '法务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业反商业贿赂声明',
                standard: '企业及所属人员，为企业办理海关业务的委托代理人员或者其他相关人员向海关人员行贿。',
                checkFile: '',
                checkInterview: '企业是否存在向海关人员行贿的情形',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '反商业贿赂管理制度',
                '廉洁承诺书'
              ],
                checkPoints: [
                '企业及所属人员是否向海关人员行贿'
              ]
              }
          ]
          },
          {
            name: '16. 海关信用',
            items: [
            {
                id: 'LC-22',
                officialId: '(37)',
                name: '海关信用-其他企业任职',
                desc: '相关人员在其他企业任职的非失信企业',
                dept: 'HR',
                supportDept: '总经办',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '相关人员任职企业信用查询记录',
                standard: '企业相关人员以法定代表人（主要负责人）或者财务负责人、关务负责人、报关人员身份任职的其他企业未被海关认定为失信企业或者严重失信企业。',
                checkFile: '相关人员任职企业清单、信用等级查询记录',
                checkInterview: '企业相关人员在其他企业任职情况；这些企业的海关信用等级',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '任职企业清单',
                '信用查询结果'
              ],
                checkPoints: [
                '相关人员任职的其他企业未被认定为失信/严重失信企业'
              ]
              },
            {
                id: 'LC-23',
                officialId: '(38)',
                name: '海关信用-分支机构',
                desc: '分支机构未被认定为失信企业',
                dept: '总经办',
                supportDept: '关务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '分支机构信用查询记录',
                standard: '企业的分支机构、分支机构所属企业以及其他分支机构未被海关认定为失信企业或者严重失信企业。',
                checkFile: '分支机构清单及信用等级查询记录',
                checkInterview: '企业分支机构的海关信用等级情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '分支机构信用查询结果'
              ],
                checkPoints: [
                '分支机构未被认定为失信/严重失信企业'
              ]
              },
            {
                id: 'LC-24',
                officialId: '(39)',
                name: '海关信用-出资人',
                desc: '出资人未被认定为失信企业',
                dept: '总经办',
                supportDept: '财务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '出资人信用查询记录',
                standard: '企业在市场监管部门备案的出资人未被海关认定为失信企业或者严重失信企业。',
                checkFile: '出资人清单及信用等级查询记录',
                checkInterview: '企业出资人的海关信用等级情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '出资人信用查询结果'
              ],
                checkPoints: [
                '出资人未被认定为失信/严重失信企业'
              ]
              }
          ]
          },
          {
            name: '17. 外部信用',
            items: [
            {
                id: 'LC-25',
                officialId: '(40)',
                name: '外部信用-公共信用',
                desc: '国家公共信用综合评价B以上',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '国家公共信用综合评价结果',
                standard: '国家公共信用综合评价为B以上。',
                checkFile: '国家公共信用综合评价报告',
                checkInterview: '企业公共信用综合评价等级',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '信用中国报告',
                '公共信用综合评价结果'
              ],
                checkPoints: [
                '国家公共信用综合评价是否为B以上'
              ]
              },
            {
                id: 'LC-26',
                officialId: '(41)',
                name: '外部信用-信用中国公示',
                desc: '企业及人员无严重失信信息在信用中国公示',
                dept: '总经办',
                supportDept: 'HR',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '信用中国查询记录',
                standard: '企业及企业相关人员无严重失信信息在"信用中国"网站处于公示状态。',
                checkFile: '信用中国查询结果',
                checkInterview: '企业和人员在信用中国是否有严重失信信息公示',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '信用中国查询结果截图'
              ],
                checkPoints: [
                '企业及人员是否在信用中国有严重失信公示信息'
              ]
              },
            {
                id: 'LC-27',
                officialId: '(42)',
                name: '外部信用-出资人信用中国',
                desc: '出资人无严重失信信息在信用中国公示',
                dept: '总经办',
                supportDept: '财务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '出资人信用中国查询记录',
                standard: '企业在市场监管部门备案的出资人无严重失信信息在"信用中国"网站处于公示状态。',
                checkFile: '出资人信用中国查询结果',
                checkInterview: '出资人在信用中国是否有严重失信信息公示',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '出资人信用中国查询结果截图'
              ],
                checkPoints: [
                '出资人是否在信用中国有严重失信公示信息'
              ]
              },
            {
                id: 'LC-28',
                officialId: '(43)',
                name: '外部信用-最低信用等级',
                desc: '企业及出资人未被公示为最低信用等级',
                dept: '总经办',
                supportDept: '财务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '信用等级查询记录',
                standard: '企业及其在市场监管部门备案的出资人未在"信用中国"网站被公示为国家相关部门评定的最低信用等级。',
                checkFile: '信用等级查询结果',
                checkInterview: '企业和出资人在信用中国的信用等级是否被公示为最低等级',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '信用等级查询结果'
              ],
                checkPoints: [
                '企业未被公示为最低信用等级',
                '出资人未被公示为最低信用等级'
              ]
              }
          ]
          }
      ]
    },

    // ─── 四、贸易安全标准（25项）───────────────────────────────────────
    security: {
      title: '贸易安全',
      icon: 'shield-alt',
      color: 'amber',
      subcategories: [
          {
            name: '18. 经营场所安全',
            items: [
            {
                id: 'SE-01',
                officialId: '(44)',
                name: '场所安全-设施管控',
                desc: '场所具有设施防止未授权进入',
                dept: '行政部',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '场所安全制度+设施检查记录',
                standard: '根据业务模式和风险防范需要，对经营场所安全进行管控。经营场所应当具有相应设施防止未载明货物、物品和未经许可人员进入。',
                checkFile: '场所安全管理制度',
                checkInterview: '经营场所分布情况和安全风险点；防未授权进入设施情况',
                checkSite: '出入口/围墙/停车场等场所设施情况',
                checkRandom: '',
                sampleDocs: [
                '场所安全管理制度',
                '场所布局图',
                '设施检查记录'
              ],
                checkPoints: [
                '场所是否具有防止未授权进入的设施',
                '是否有防止未载明货物进入的措施'
              ]
              },
            {
                id: 'SE-02',
                officialId: '(45)',
                name: '场所安全-门窗围墙',
                desc: '内外门窗/大门/围墙锁闭和监控保护',
                dept: '行政部',
                supportDept: 'IT部',
                frequency: '每月',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '锁闭装置检查记录+钥匙领用/权限管理记录',
                standard: '使用锁闭装置或者采取进出监控以及指纹、人脸识别等进出控制措施保护所有内外部窗户、大门和围墙的安全，实施钥匙发放与回收的登记管理或者进出权限的授予与取消管理。',
                checkFile: '门禁/锁闭管理制度',
                checkInterview: '窗户/大门/围墙的保护措施；钥匙发放和回收登记管理',
                checkSite: '实地查看窗户/大门/围墙的门禁和锁闭装置',
                checkRandom: '钥匙领用退还登记表、门禁权限变更记录',
                sampleDocs: [
                '保安巡查记录表',
                '钥匙领用退还登记表',
                '门禁权限管理记录'
              ],
                checkPoints: [
                '内外窗户/大门/围墙是否有锁闭或监控保护',
                '钥匙发放与回收是否有登记管理',
                '进出权限授予与取消是否有管理'
              ]
              },
            {
                id: 'SE-03',
                officialId: '(46)',
                name: '场所安全-出入口控制',
                desc: '车辆人员进出控制和授权管理',
                dept: '行政部',
                supportDept: '',
                frequency: '每日',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '出入口控制制度+值守记录',
                standard: '车辆、人员进出企业的出入口配备人员值守或者实施技术手段等措施进行控制。仅允许经正确识别和授权的人员、车辆和货物、物品进出。',
                checkFile: '人员和车辆出入管理制度',
                checkInterview: '出入口控制方式和人员配备；识别和授权流程',
                checkSite: '出入口值守情况和识别设备使用情况',
                checkRandom: '',
                sampleDocs: [
                '出入管理制度',
                '值守排班表',
                '外来车辆人员登记表'
              ],
                checkPoints: [
                '出入口是否配备人员值守或技术手段控制',
                '是否仅允许经识别和授权的人员/车辆进出'
              ]
              },
            {
                id: 'SE-04',
                officialId: '(47)',
                name: '场所安全-受控区域',
                desc: '单证/数据/货物/机房等区域受控进入',
                dept: '行政部',
                supportDept: 'IT部',
                frequency: '每月',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '受控区域管理制度+标识+进入记录',
                standard: '对单证存放、数据存储区域以及货物、物品装卸和仓储区域、机房等实施受控进入管理，受控区域标识清晰。',
                checkFile: '',
                checkInterview: '受控区域范围和管控措施',
                checkSite: '单证存放/数据存储/装卸仓储/机房等区域标识和管控情况',
                checkRandom: '',
                sampleDocs: [
                '受控区域管理制度',
                '区域标识照片'
              ],
                checkPoints: [
                '受控区域是否标识清晰',
                '受控区域是否有进入管控措施'
              ]
              },
            {
                id: 'SE-05',
                officialId: '(48)',
                name: '场所安全-视频监控',
                desc: '重要区域视频监控覆盖',
                dept: '行政部',
                supportDept: 'IT部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '监控系统布局图+监控存储记录',
                standard: '经营场所装有视频监控系统，至少覆盖以下重要敏感区域：出入口，货物、物品装卸和仓储区域，围墙周边及停车场/停车区域等。视频监控记录保存时限能够满足企业自身供应链安全检查追溯的要求。',
                checkFile: '',
                checkInterview: '视频监控覆盖范围和保存时限',
                checkSite: '监控室/监控设备运行情况；监控覆盖范围演示',
                checkRandom: '视频监控录像保存情况',
                sampleDocs: [
                '监控系统布局图',
                '视频监控日常点检表'
              ],
                checkPoints: [
                '视频监控是否覆盖出入口/装卸仓储区/围墙周边/停车场',
                '监控记录保存时限是否满足追溯要求'
              ]
              }
          ]
          },
          {
            name: '19. 人员安全',
            items: [
            {
                id: 'SE-06',
                officialId: '(49)',
                name: '人员安全-员工档案',
                desc: '员工档案管理和动态员工清单',
                dept: 'HR',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '员工花名册+员工档案+敏感岗位人员专业背景',
                standard: '实施员工档案管理，具有动态的员工清单。安排具有专业背景的人员担任生物安全，进出口食品、化妆品安全，质量安全等相关岗位管理人员。',
                checkFile: '员工档案管理制度、员工清单',
                checkInterview: '员工清单是否动态更新；敏感岗位人员专业背景情况',
                checkSite: '',
                checkRandom: '员工档案（含入职时间/岗位/资质等）',
                sampleDocs: [
                '员工花名册',
                '员工档案',
                '岗位资质证明'
              ],
                checkPoints: [
                '是否有动态员工清单',
                '敏感岗位人员是否具有专业背景'
              ]
              },
            {
                id: 'SE-07',
                officialId: '(50)',
                name: '人员安全-背景调查',
                desc: '招聘时核实犯罪记录，敏感岗位定期背景调查',
                dept: 'HR',
                supportDept: '法务部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '招聘背调制度+背调记录',
                standard: '招聘新员工时，在法律允许范围内采取合理预防措施，核实其有无涉及安全、进出口或者其他领域的刑事犯罪；对安全敏感岗位的员工实施定期或者有原因的背景调查。',
                checkFile: '员工招聘制度（含背景调查要求）',
                checkInterview: '招聘时背调措施；安全敏感岗位的定期背景调查安排',
                checkSite: '',
                checkRandom: '新员工背调记录、安全敏感岗位背景调查报告',
                sampleDocs: [
                '员工招聘资料',
                '背景调查记录',
                '敏感岗位背调报告'
              ],
                checkPoints: [
                '招聘时是否核实刑事犯罪记录',
                '安全敏感岗位是否定期背景调查'
              ]
              },
            {
                id: 'SE-08',
                officialId: '(51)',
                name: '人员安全-身份识别',
                desc: '员工身份标识和访客管理',
                dept: '行政部',
                supportDept: 'HR',
                frequency: '每日',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '员工身份标识+访客登记记录',
                standard: '对员工进行身份识别，要求所有员工携带企业发放的身份标识。对访客进行身份识别和进出登记管理。要求进入经营场所的访客佩戴临时身份标识，有企业内部人员陪同访客进入受控区域。',
                checkFile: '访客管理制度',
                checkInterview: '员工身份标识发放和使用情况；访客登记管理流程',
                checkSite: '员工身份标识佩戴情况和访客登记执行情况',
                checkRandom: '访客登记记录、临时身份标识发放记录',
                sampleDocs: [
                '工牌发放回收登记表',
                '入厂须知登记表',
                '外来人员车辆出入登记表'
              ],
                checkPoints: [
                '员工是否随身携带身份标识',
                '访客是否进行身份识别和登记',
                '访客是否佩戴临时标识并由内部人员陪同'
              ]
              },
            {
                id: 'SE-09',
                officialId: '(52)',
                name: '人员安全-离职管理',
                desc: '离职员工即时取消身份识别和系统授权',
                dept: 'HR',
                supportDept: 'IT部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '离职员工授权取消记录',
                standard: '对离职员工及时取消身份识别、进出经营场所和访问信息系统的授权。',
                checkFile: '员工离职管理制度',
                checkInterview: '离职员工权限取消流程和时间',
                checkSite: '',
                checkRandom: '离职员工身份标识回收记录、系统权限取消记录',
                sampleDocs: [
                '员工离职管理制度',
                '人员离职资料',
                '权限调整申请表'
              ],
                checkPoints: [
                '离职员工是否及时取消身份识别',
                '是否取消进出场所授权',
                '是否取消信息系统访问授权'
              ]
              }
          ]
          },
          {
            name: '20. 货物、物品安全',
            items: [
            {
                id: 'SE-10',
                officialId: '(53)',
                name: '货物安全-管控措施',
                desc: '保证货物在运输装卸存储中的完整性安全性',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '货物安全管理制度+交接记录',
                standard: '企业及其进出口活动中负有货物、物品安全责任的商业伙伴能够采取适当措施保证货物、物品在其管控期间的完整性、安全性，以及在运输、装卸和存储过程中能够实施有效管控。',
                checkFile: '货物物品安全管理制度',
                checkInterview: '货物在运输/装卸/存储各环节的安全管控措施',
                checkSite: '仓库/装卸区货物安全管控情况',
                checkRandom: '',
                sampleDocs: [
                '货物安全管理制度',
                '仓库管理程序',
                '运输装卸存储制度'
              ],
                checkPoints: [
                '各环节是否有货物安全管控措施',
                '商业伙伴是否也采取适当安全措施'
              ]
              },
            {
                id: 'SE-11',
                officialId: '(54)',
                name: '货物安全-装货前检查',
                desc: '七点检查法检查集装箱安全性',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '装货前检查记录（七点检查表）',
                standard: '装货前，使用"七点检查法"（即按照以下部位进行检查：前壁、左侧、右侧、地板、顶部、内/外门、外部/起落架）或者其他有效方式检查海运货物集装箱、空运集装器、厢式货车或者铁路运输集装箱的安全性。其他方式装货的，采取适当方式进行检查。',
                checkFile: '',
                checkInterview: '装货前检查方式和执行情况',
                checkSite: '',
                checkRandom: '装货前检查记录（检查项目/结果/检查人/日期）',
                sampleDocs: [
                '集装箱检查表',
                '车辆检查登记表',
                '装货安全检查展板'
              ],
                checkPoints: [
                '装货前是否使用七点检查法或其他有效方式',
                '检查记录是否留存'
              ]
              },
            {
                id: 'SE-12',
                officialId: '(55)',
                name: '货物安全-封条管理',
                desc: '封条登记管理，符合ISO 17712标准',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '封条管理制度+封条领用登记+施封照片',
                standard: '封条有专人管理和登记，使用符合或者超出现行PAS ISO 17712高度安全封条标准的智能安全封条或者机械封条。明确施加封条的流程和封条异常的处置流程，留存施加封条的照片或者视频。无法使用封条的，应当采取适当方式保护货物、物品的安全。',
                checkFile: '封条管理制度',
                checkInterview: '封条管理责任人；施封流程和异常处置流程',
                checkSite: '',
                checkRandom: '封条领用登记记录、施封照片或视频',
                sampleDocs: [
                '封条管理制度',
                '集装箱封条检查表',
                '封条领用登记表'
              ],
                checkPoints: [
                '封条是否有专人管理和登记',
                '封条是否符合ISO 17712标准',
                '施封流程和异常处置流程是否明确',
                '是否留存施封照片或视频'
              ]
              },
            {
                id: 'SE-13',
                officialId: '(56)',
                name: '货物安全-安全存放',
                desc: '货物存放在安全区域',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每日',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '存放区域安全管理记录',
                standard: '货物、物品以及装运货物、物品的集装箱应当存放在安全区域，并有效防范未经授权人员进入存放区域。',
                checkFile: '',
                checkInterview: '货物/集装箱存放区域的安全管理措施',
                checkSite: '货物/集装箱存放区域的安全管控情况',
                checkRandom: '',
                sampleDocs: [
                '仓库管理制度',
                '区域安全检查记录'
              ],
                checkPoints: [
                '货物是否存放在安全区域',
                '是否有效防范未经授权人员进入存放区域'
              ]
              },
            {
                id: 'SE-14',
                officialId: '(57)',
                name: '货物安全-运输核实',
                desc: '装运/接收前核实运输工具信息和驾驶人员身份',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '运输工具信息核实记录+驾驶人员身份核实记录',
                standard: '装运或者接收货物、物品前，对装运或者接收货物、物品的运输工具信息及驾驶人员身份进行核实。',
                checkFile: '',
                checkInterview: '装运/接收前核实运输工具和驾驶员身份的执行情况',
                checkSite: '',
                checkRandom: '运输工具信息登记记录、驾驶员身份核实记录',
                sampleDocs: [
                '车辆检查登记表',
                '司机提货登记及身份核实'
              ],
                checkPoints: [
                '装运前是否核实运输工具信息和驾驶员身份',
                '接收前是否核实'
              ]
              },
            {
                id: 'SE-15',
                officialId: '(58)',
                name: '货物安全-交接确认',
                desc: '装运和接收流程明确，交接确认措施',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '装运/接收流程文件+交接确认记录',
                standard: '明确装运和接收的流程和要求，确保货物、物品与进出口单证信息相符。对运抵的货物、物品核实其标签、数量和重量，对离岸的货物、物品核实购货订单或者装运订单上的内容。在货物、物品关键交接环节实施签名、盖章或者其它确认措施。',
                checkFile: '装运/接收流程文件',
                checkInterview: '装运和接收环节的核实流程；关键交接环节的确认措施',
                checkSite: '实际装运/接收操作流程',
                checkRandom: '交接确认记录（签字/盖章/系统确认等）',
                sampleDocs: [
                '装运/接收流程文件',
                '交接确认单',
                '仓库作业制度'
              ],
                checkPoints: [
                '装运前是否核实订单内容',
                '运抵时是否核实标签/数量/重量',
                '关键交接环节是否有签名/盖章等确认措施'
              ]
              },
            {
                id: 'SE-16',
                officialId: '(59)',
                name: '货物安全-木质包装',
                desc: '申报前核实木质包装IPPC标识',
                dept: '关务部',
                supportDept: '物流/仓储',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '木质包装核实记录',
                standard: '申报前对进境货物是否使用木质包装进行核实，确认使用具有有效的国际植物保护公约专用标识的木质包装；出境货物使用木质包装的，申报前应确认其已经按要求实施除害处理并加施专用标识。',
                checkFile: '',
                checkInterview: '木质包装核实流程和记录',
                checkSite: '',
                checkRandom: '木质包装核实记录',
                sampleDocs: [
                '木质包装查验记录',
                'IPPC标识照片'
              ],
                checkPoints: [
                '进境货物是否核实木质包装IPPC标识',
                '出境木质包装是否确认除害处理和标识'
              ]
              },
            {
                id: 'SE-17',
                officialId: '(60)',
                name: '货物安全-异常报告',
                desc: '货物差异或不合格时及时报告',
                dept: '关务部',
                supportDept: '质检部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '异常报告记录',
                standard: '在出现货物、物品差异，法检商品安全、卫生、环保等指标不合格或者其他异常现象时要及时报告或者采取其他应对措施。',
                checkFile: '',
                checkInterview: '货物异常情况报告流程和执行情况',
                checkSite: '',
                checkRandom: '异常情况报告记录',
                sampleDocs: [
                '异常情况报告表',
                '异常处置记录'
              ],
                checkPoints: [
                '货物差异是否及时报告',
                '法检商品不合格是否及时报告',
                '其他异常是否采取应对措施'
              ]
              },
            {
                id: 'SE-18',
                officialId: '(61)',
                name: '货物安全-出口监装',
                desc: '对出口货物实施监装并拍照视频留存',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '监装记录+装货过程照片/视频',
                standard: '对出口货物、物品实施监装，对装货过程进行拍照或者视频留存。',
                checkFile: '',
                checkInterview: '出口监装执行情况和记录留存',
                checkSite: '',
                checkRandom: '监装记录、装货过程照片或视频',
                sampleDocs: [
                '监装记录表',
                '装货过程照片'
              ],
                checkPoints: [
                '出口货物是否实施监装',
                '装货过程是否拍照或视频留存'
              ]
              }
          ]
          },
          {
            name: '21. 运输工具安全',
            items: [
            {
                id: 'SE-19',
                officialId: '(62)',
                name: '运输工具安全-管控措施',
                desc: '保证运输工具完整性安全性的管控措施',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '运输工具安全管理制度',
                standard: '企业及其进出口活动中负有运输工具安全责任的商业伙伴能够采取适当的措施保证运输工具的完整性、安全性，以及在运输、装卸和存储过程中能够实施有效管控。',
                checkFile: '运输工具安全管理制度',
                checkInterview: '运输工具安全管理责任部门/岗位；运输方式的管控措施',
                checkSite: '',
                checkRandom: '不涉及运输的提供书面说明',
                sampleDocs: [
                '运输工具安全管理制度',
                '物流运输标准'
              ],
                checkPoints: [
                '运输工具安全管控措施是否到位',
                '商业伙伴是否也采取适当措施'
              ]
              },
            {
                id: 'SE-20',
                officialId: '(63)',
                name: '运输工具安全-藏匿检查',
                desc: '检查运输工具可能藏匿非法物品的区域',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '运输工具检查记录',
                standard: '针对运输工具可能藏匿非法、可疑货物、物品的区域进行检查，记录已检查的区域，并明确发现异常、可疑或者实际破损的处置流程。',
                checkFile: '',
                checkInterview: '运输工具检查区域和检查流程；异常处置流程',
                checkSite: '',
                checkRandom: '运输工具检查记录（检查区域/结果/人员/日期）',
                sampleDocs: [
                '货车十点检查表',
                '车底检查记录',
                '车辆检查登记表'
              ],
                checkPoints: [
                '是否检查运输工具可能藏匿非法物品的区域',
                '检查结果是否有记录',
                '异常处置流程是否明确'
              ]
              },
            {
                id: 'SE-21',
                officialId: '(64)',
                name: '运输工具安全-停放看守',
                desc: '无人看管运输工具的安全防范',
                dept: '行政部',
                supportDept: '物流/仓储',
                frequency: '每日',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '停放区域安全管理制度',
                standard: '在责任范围内，采取适当措施对无人看管的运输工具进行安全防范，并在返回时检查运输工具是否存在安全隐患。',
                checkFile: '',
                checkInterview: '无人看管运输工具的安全防范措施',
                checkSite: '运输工具停放区域安全管控情况',
                checkRandom: '运输工具返回检查记录',
                sampleDocs: [
                '车辆停放管理制度',
                '车辆返回检查表'
              ],
                checkPoints: [
                '无人看管运输工具是否有安全防范措施',
                '返回时是否检查安全隐患'
              ]
              },
            {
                id: 'SE-22',
                officialId: '(65)',
                name: '运输工具安全-驾驶员培训',
                desc: '对驾驶员进行运输和货物安全培训',
                dept: '物流/仓储',
                supportDept: 'HR',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '驾驶员培训计划+培训记录',
                standard: '对驾驶人员开展保障运输工具和货物、物品安全培训。',
                checkFile: '',
                checkInterview: '驾驶员安全培训计划和开展情况',
                checkSite: '',
                checkRandom: '驾驶员培训记录（培训内容/时间/参加人员）',
                sampleDocs: [
                '驾驶员安全培训教材',
                '培训签到表'
              ],
                checkPoints: [
                '是否对驾驶员开展安全培训',
                '培训是否覆盖运输工具和货物安全'
              ]
              }
          ]
          },
          {
            name: '22. 商业伙伴安全',
            items: [
            {
                id: 'SE-23',
                officialId: '(66)',
                name: '商业伙伴安全-资质审核',
                desc: '签订合同前审核商业伙伴资质和守法合规情况',
                dept: '采购部',
                supportDept: '关务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '商业伙伴审核制度+审核记录',
                standard: '在签订合同、协议前，审核与进出口活动相关的国内商业伙伴的业务资质以及守法合规等情况，并在执行合同、协议过程中动态关注商业伙伴相关情况。商业伙伴为海关高级认证企业或者认证企业的，企业可免于审核相关情况；商业伙伴中有失信企业或者严重失信企业，但未动态关注且采取相应措施的，视为不达标。',
                checkFile: '商业伙伴管理制度（含审核要求/动态关注/档案保管）',
                checkInterview: '商业伙伴审核执行情况；动态关注机制',
                checkSite: '',
                checkRandom: '商业伙伴资质审核记录、信用等级动态关注记录',
                sampleDocs: [
                '供应商管理细则',
                '守法合规与贸易安全检查清单',
                '新供应商评价表'
              ],
                checkPoints: [
                '签订合同前是否审核商业伙伴资质和守法合规',
                '执行过程中是否动态关注',
                '高级认证企业可免于审核'
              ]
              },
            {
                id: 'SE-24',
                officialId: '(67)',
                name: '商业伙伴安全-动态名单',
                desc: '完整动态的商业伙伴名单',
                dept: '采购部',
                supportDept: '关务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '商业伙伴名单',
                standard: '具有完整、动态的商业伙伴名单。',
                checkFile: '商业伙伴名单',
                checkInterview: '商业伙伴名单是否完整和动态更新',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '供应商清单',
                '商业伙伴名册'
              ],
                checkPoints: [
                '商业伙伴名单是否完整',
                '名单是否动态更新'
              ]
              }
          ]
          },
          {
            name: '23. 贸易安全培训',
            items: [
            {
                id: 'SE-25',
                officialId: '(68)',
                name: '贸易安全培训',
                desc: '对相关岗位和委托代理企业开展贸易安全培训',
                dept: 'HR',
                supportDept: '行政部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '培训制度+培训计划+培训记录',
                standard: '根据业务模式，采取适当方式对相关岗位员工以及委托代理企业开展相关培训，让员工以及委托代理企业了解并掌握在识别并报告可疑事件、防范潜在内部安全威胁以及保障货物、物品安全等方面应做的工作。',
                checkFile: '贸易安全培训制度',
                checkInterview: '培训责任部门/岗位；培训计划和开展情况；培训内容是否覆盖可疑事件报告/安全威胁防范等',
                checkSite: '',
                checkRandom: '贸易安全培训记录（培训内容/参加人员/时间）',
                sampleDocs: [
                '供应链安全培训教材',
                '贸易安全培训记录',
                '防恐安全培训'
              ],
                checkPoints: [
                '培训是否覆盖相关岗位员工',
                '委托代理企业是否也接受培训',
                '培训内容是否包括可疑事件报告/安全威胁防范'
              ]
              }
          ]
          }
      ]
    },

    // ─── 五、附加标准 / 加分标准（6项）─────────────────────────────────
    bonus: {
      title: '附加标准',
      icon: 'star',
      color: 'yellow',
      subcategories: [
          {
            name: '24. 加分标准',
            items: [
            {
                id: 'BN-01',
                officialId: '(69)',
                name: '绿色工厂/供应链',
                desc: '国家级绿色工厂或绿色供应链管理企业',
                dept: '总经办',
                supportDept: '行政部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '绿色工厂/绿色供应链认定证书',
                standard: '国家级绿色工厂或者绿色供应链管理企业。',
                checkFile: '认定证书或文件',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '国家级绿色工厂证书',
                '绿色供应链管理企业认定文件'
              ],
                checkPoints: [
                '是否为国家级绿色工厂',
                '或绿色供应链管理企业'
              ]
              },
            {
                id: 'BN-02',
                officialId: '(70)',
                name: '专精特新小巨人',
                desc: '国家级专精特新"小巨人"企业',
                dept: '总经办',
                supportDept: '技术部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '专精特新认定证书',
                standard: '国家级专精特新"小巨人"企业。',
                checkFile: '认定证书或文件',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '专精特新小巨人企业证书'
              ],
                checkPoints: [
                '是否为国家级专精特新小巨人企业'
              ]
              },
            {
                id: 'BN-03',
                officialId: '(71)',
                name: '企业技术中心',
                desc: '企业技术中心（国家级）',
                dept: '技术部',
                supportDept: '总经办',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '国家认定企业技术中心文件',
                standard: '企业技术中心（国家级）。',
                checkFile: '认定证书或文件',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '国家企业技术中心认定文件'
              ],
                checkPoints: [
                '是否被认定为国家企业技术中心'
              ]
              },
            {
                id: 'BN-04',
                officialId: '(72)',
                name: '海关统计样本',
                desc: '海关法定统计调查项目样本企业',
                dept: '关务部',
                supportDept: '财务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关统计调查样本企业证明',
                standard: '海关法定统计调查项目的样本企业，并且按照海关要求真实、准确、完整、及时提交统计调查所需的资料。',
                checkFile: '海关统计样本企业确认文件',
                checkInterview: '是否按要求及时提交统计调查资料',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '海关统计样本企业证明',
                '统计调查资料提交记录'
              ],
                checkPoints: [
                '是否被选为海关统计样本企业',
                '是否按要求提交统计调查资料'
              ]
              },
            {
                id: 'BN-05',
                officialId: '(73)',
                name: '委托报关企业信用',
                desc: '委托的报关企业全部为高级认证或认证企业',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '委托报关企业信用等级清单',
                standard: '申请高级认证企业的，1年内委托的报关企业信用等级全部为高级认证企业或者认证企业；已经成为高级认证企业的，复核周期内委托的报关企业信用等级全部为高级认证企业或者认证企业。',
                checkFile: '委托报关企业信用等级清单',
                checkInterview: '委托报关企业的信用等级情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '报关企业信用等级查询记录',
                '委托报关协议'
              ],
                checkPoints: [
                '委托的报关企业信用等级是否全部为高级认证或认证企业'
              ]
              },
            {
                id: 'BN-06',
                officialId: '(74)',
                name: '关务水平评估',
                desc: '报关人员通过海关认可的关务水平评估',
                dept: '关务部',
                supportDept: 'HR',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '报关人员关务水平评估证书',
                standard: '企业所属报关人员全部通过海关认可的初级关务水平评估，或者企业所属报关人员中通过海关认可的中级关务水平评估的人数占比达到30%以上，或者企业所属报关人员中通过海关认可的高级关务水平评估的人数占比达到10%以上（至少1人）。企业所属报关人员不足5人的不适用本项标准。',
                checkFile: '报关人员关务水平评估证书',
                checkInterview: '报关人员关务水平评估通过情况',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [
                '初级关务水平评估证书',
                '中级/高级关务水平评估证书'
              ],
                checkPoints: [
                '报关人员是否全部通过初级评估',
                '或中级占比≥30%',
                '或高级占比≥10%且至少1人',
                '不足5人不适用'
              ]
              }
          ]
          }
      ]
    }
  },

  // ======================================================================
  // 认证企业标准（一般认证）— 通用标准 + 附加标准（共62项）
  // 来源：海关总署公告2026年第34号 附件5
  // ======================================================================
  certified: {
      // ─── 一、内部控制标准（10项）──────────────────────────────────────
    internal: {
      title: '内部控制',
      icon: 'sitemap',
      color: 'blue',
      subcategories: [
          {
            name: '1. 关企合作',
            items: [
            {
                id: 'C-IC01',
                officialId: '(1)',
                name: '关企合作-海关联系人',
                desc: '指定海关业务联系人',
                dept: '关务部',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '沟通记录',
                standard: '指定海关业务联系人，通过"中国海关信用管理服务平台"等方式与海关开展沟通与合作。企业相关人员在其他企业担任法定代表人（主要负责人）或者财务负责人的，须及时将有关情况告知海关。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否指定海关业务联系人',
                '相关人员在其他企业任职是否及时告知'
              ]
              },
            {
                id: 'C-IC02',
                officialId: '(2)',
                name: '关企合作-高管管控',
                desc: '法定代表人/关务负责人掌握进出口总体情况',
                dept: '总经办',
                supportDept: '关务部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '高管了解业务情况记录',
                standard: '法定代表人（主要负责人）或者负责关务的高级管理人员（关务负责人）应当掌握企业涉及海关业务的总体情况，包括进出口业务、遵守海关监管规定、信用状况等，有效管控企业发生的进出口不规范情形、违法情事等。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '法定代表人/关务负责人是否掌握进出口总体情况'
              ]
              },
            {
                id: 'C-IC03',
                officialId: '(3)',
                name: '关企合作-岗位能力',
                desc: '关务及进出口人员熟悉业务及海关要求',
                dept: '关务部',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '岗位培训记录',
                standard: '关务人员、所属报关人员以及进出口相关岗位人员应当熟悉本岗位相关的进出口业务以及海关管理要求，及时处置进出口不规范情形、违法情事等并有效整改。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '关务人员是否熟悉进出口业务和海关管理要求'
              ]
              },
            {
                id: 'C-IC04',
                officialId: '(4)',
                name: '关企合作-配合海关',
                desc: '积极配合海关稽查调查核查等工作',
                dept: '关务部',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '配合海关工作记录',
                standard: '积极配合或者协助海关办理相关案件的侦查、调查，以及开展稽查、贸易调查、核查等相关工作，并提供涉及相关案件、情事的数据或者资料。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否积极配合海关稽查/调查/核查'
              ]
              }
          ]
          },
          {
            name: '2. 单证复核',
            items: [
            {
                id: 'C-IC05',
                officialId: '(5)',
                name: '单证复核',
                desc: '申报前内部复核单证真实完整性',
                dept: '关务部',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '复核制度+复核记录',
                standard: '明确制单、复核岗位工作流程和审核指引，在申报前或者委托申报前有专门部门或者岗位人员对申报内容和进出口单证的真实性、完整性、准确性和规范性进行内部复核。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '申报前是否有内部复核',
                '复核是否覆盖真实性/完整性/准确性/规范性'
              ]
              }
          ]
          },
          {
            name: '3. 单证保管',
            items: [
            {
                id: 'C-IC06',
                officialId: '(6)',
                name: '单证保管',
                desc: '进出口单证按规定归档保管',
                dept: '关务部',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '保管制度+归档记录',
                standard: '明确进出口单证、相关记录的归档工作流程和保管要求，按照法律、行政法规、海关总署规章、海关总署公告等相关规定建立并妥善保存海关要求保管的账簿、单证、记录等有关资料以及与进出口直接相关的其他资料和海关核发的证书、法律文书等。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '归档流程是否明确',
                '保管是否合规'
              ]
              }
          ]
          },
          {
            name: '4. 禁限审查',
            items: [
            {
                id: 'C-IC07',
                officialId: '(7)',
                name: '禁限审查',
                desc: '专门岗位审查货物禁止/限制性规定',
                dept: '关务部',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '审查制度+审查记录',
                standard: '有专门部门或者岗位人员根据国家对进出境货物、物品有关禁止性管理或者限制性管理规定，对进出境货物、物品情况进行审查，明确审查流程和处置要求。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否有专门部门/岗位负责禁限审查'
              ]
              }
          ]
          },
          {
            name: '5. 信息系统',
            items: [
            {
                id: 'C-IC08',
                officialId: '(8)',
                name: '信息系统',
                desc: '建立信息管理系统，数据保存3年以上',
                dept: 'IT部',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '系统截图+数据保存证明',
                standard: '建立真实、准确、完整并有效管理企业生产经营、进出口活动、财务等的信息系统，系统数据自进出口货物办结海关手续之日起保存3年以上。企业的ERP系统或跨境电商平台已与海关对接且满足海关管理要求的，海关不再对本项标准进行认证，视为达标。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '信息系统是否覆盖生产经营/进出口/财务管理',
                '系统数据是否保存3年以上'
              ]
              }
          ]
          },
          {
            name: '6. 内部审计和改进',
            items: [
            {
                id: 'C-IC09',
                officialId: '(9)',
                name: '内部审计',
                desc: '每年对进出口守法规范情况进行内部审计',
                dept: '内审部',
                supportDept: '关务部',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '审计制度+审计报告',
                standard: '申请成为认证企业的，企业对上一审计年度的进出口守法、规范情况进行内部审计，并向海关提交内部审计报告；成立不满1年的，提交自成立以来的内部审计报告。已经成为认证企业的，企业每年对上一审计年度的进出口守法、规范情况及持续符合认证企业标准开展内部审计，并形成专门档案，按照海关要求或者在海关复核时提交。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否每年进行内部审计',
                '是否形成专门档案'
              ]
              },
            {
                id: 'C-IC10',
                officialId: '(10)',
                name: '改进机制',
                desc: '法定代表人组织开展问题处置和改进',
                dept: '总经办',
                supportDept: '关务部',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '问题处置和改进记录',
                standard: '企业存在的未按规定报送企业信用信息年度报告、海关责令或者要求规范整改事项、违法情事、内部审计发现的涉及进出口业务问题，应当由法定代表人（主要负责人）或者负责关务的高级管理人员组织开展处置和改进。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '问题是否由法定代表人/关务负责人组织处置和改进'
              ]
              }
          ]
          }
      ]
    },

    finance: {
      title: '财务状况',
      icon: 'chart-line',
      color: 'emerald',
      subcategories: [
          {
            name: '7. 财务状况',
            items: [
            {
                id: 'C-FI01',
                officialId: '(11)',
                name: '财务状况-审计报告',
                desc: '审计报告意见类型',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '审计报告',
                standard: '会计师事务所审计报告所反映的企业财务状况真实、完整、规范、合法。审计报告为无保留意见的，达标；审计报告为保留意见的，基本达标；审计报告为否定意见或者无法表示意见的，不达标。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '审计报告是否为无保留意见'
              ]
              },
            {
                id: 'C-FI02',
                officialId: '(12)',
                name: '财务状况-偿债能力',
                desc: '偿债能力指标',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '财务指标分析',
                standard: '具有一定的偿债能力。①资产负债率（总负债/总资产×100%）≤95%（生产型），资产负债率≤85%（非生产型）；②现金比率≥0.1；③经营现金流负债比≥0；④流动比率≥0.8。2项及以上符合为达标；仅1项为基本达标；都不符合为不达标。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '资产负债率是否达标',
                '现金比率是否≥0.1',
                '流动比率是否≥0.8'
              ]
              },
            {
                id: 'C-FI03',
                officialId: '(13)',
                name: '财务状况-破产退出',
                desc: '无进入解散程序或被宣告破产',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业状态说明',
                standard: '进入解散程序或者被依法宣告破产的，视为不达标。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否存在解散或破产情形'
              ]
              }
          ]
          }
      ]
    },

    compliance: {
      title: '守法规范',
      icon: 'balance-scale',
      color: 'violet',
      subcategories: [
          {
            name: '8. 注册备案信息',
            items: [
            {
                id: 'C-LC01',
                officialId: '(14)',
                name: '注册备案信息',
                desc: '海关注册信息与实际相符，1年内无不办理变更',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '注册信息核对记录',
                standard: '企业在海关注册登记或者备案信息与实际相符，1年内无未按规定办理海关变更手续的情形。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '注册信息与实际是否相符',
                '1年内是否有未按规定办理变更的情形'
              ]
              }
          ]
          },
          {
            name: '9. 遵守法律法规',
            items: [
            {
                id: 'C-LC02',
                officialId: '(15)',
                name: '遵守法律法规-刑事犯罪',
                desc: '企业相关人员1年内无故意犯罪刑事处罚',
                dept: 'HR',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '无犯罪记录证明',
                standard: '企业相关人员1年内未因故意犯罪被刑事处罚。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '相关人员1年内是否因故意犯罪被刑事处罚'
              ]
              },
            {
                id: 'C-LC03',
                officialId: '(16)',
                name: '遵守法律法规-单次处罚',
                desc: '1年内单次处罚≤10万元或未超进出口总值万分之一',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关处罚情况',
                standard: '1年内无被海关单次行政处罚金额超过10万元的行为，但单次处罚金额未超过上年度进出口总值万分之一的除外。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '单次处罚金额是否超过10万元'
              ]
              },
            {
                id: 'C-LC04',
                officialId: '(17)',
                name: '遵守法律法规-处罚次数',
                desc: '1年内处罚次数≤5次且金额≤30万元',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '处罚统计',
                standard: '1年内被海关行政处罚次数不超过5次或者违法次数不超过上年度报关相关单证总票数千分之五，且被海关行政处罚金额累计不超过30万元。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '处罚次数≤5次或≤总票数千分之五',
                '累计金额≤30万元'
              ]
              },
            {
                id: 'C-LC05',
                officialId: '(18)',
                name: '遵守法律法规-固废/管制',
                desc: '1年内无固废/出口管制违法处罚',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '处罚查询记录',
                standard: '1年内无因违反国家对进口固体废物、出口管制相关禁止性或者限制性管理规定被海关行政处罚的情形。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否有固废/出口管制违规处罚'
              ]
              }
          ]
          },
          {
            name: '10. 业务开展',
            items: [
            {
                id: 'C-LC06',
                officialId: '(19)',
                name: '业务开展',
                desc: '2年内有进出口活动',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '进出口记录',
                standard: '2年内有进出口活动或者开展的进出口业务与海关直接相关。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '2年内是否有进出口活动或与海关直接相关的业务'
              ]
              }
          ]
          },
          {
            name: '11. 款项缴纳',
            items: [
            {
                id: 'C-LC07',
                officialId: '(20)',
                name: '款项缴纳',
                desc: '1年内无超期未缴纳税款/罚款/违法所得',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '缴费凭证',
                standard: '1年内无超过法定期限未缴纳海关要求缴纳的税款（包括滞纳金）、罚款、没收的违法所得的情形（海关同意延期缴纳的除外）。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否超期未缴纳税款/罚款/违法所得'
              ]
              }
          ]
          },
          {
            name: '12. 申报规范',
            items: [
            {
                id: 'C-LC08',
                officialId: '(21)',
                name: '申报规范',
                desc: '报关单查获率不超过规定标准',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '查获统计分析',
                standard: '1年内海关检查企业自理申报的报关单票数在50票以下的，报关单查获票数不超过5票且高质量查获报关单票数不超过2票；1年内海关检查企业自理申报的报关单票数超过50票的，报关单查获率不超过10%且高质量查获率不超过3%。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '查获率≤10%',
                '高质量查获率≤3%'
              ]
              }
          ]
          },
          {
            name: '13. 税款要求',
            items: [
            {
                id: 'C-LC09',
                officialId: '(22)',
                name: '税款要求',
                desc: '1年内追征税款≤30万元，或次数≤3次',
                dept: '财务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '追征税款记录',
                standard: '1年内累计追征税款金额不超过30万元，或者1年内被追征税款超过10万元的情形不超过3次且累计追征税款金额不超过企业上年度总纳税额的千分之三。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '追征税款≤30万元',
                '或次数≤3次且≤总纳税额千分之三'
              ]
              }
          ]
          },
          {
            name: '14. 委托要求',
            items: [
            {
                id: 'C-LC10',
                officialId: '(23)',
                name: '委托要求-委托报关',
                desc: '1年内未委托失信企业报关',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '报关企业信用核查记录',
                standard: '1年内未委托信用等级为失信企业或者严重失信企业的报关企业办理海关业务。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否委托失信企业报关'
              ]
              },
            {
                id: 'C-LC11',
                officialId: '(24)',
                name: '委托要求-接受委托',
                desc: '1年内未接受失信企业委托',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '客户信用核查记录',
                standard: '1年内未接受信用等级为失信企业或者严重失信企业的生产销售单位或者消费使用单位委托办理海关业务。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否接受失信企业委托'
              ]
              }
          ]
          },
          {
            name: '15. 管理要求',
            items: [
            {
                id: 'C-LC12',
                officialId: '(25)',
                name: '管理要求-异常名录',
                desc: '1年内未被列入海关信用信息异常企业名录',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '信用查询记录',
                standard: '1年内海关未发现企业被列入海关信用信息异常企业名录。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否被列入异常企业名录'
              ]
              },
            {
                id: 'C-LC13',
                officialId: '(26)',
                name: '管理要求-虚增贸易',
                desc: '1年内无虚增贸易被海关统计处置',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关统计处置记录',
                standard: '1年内海关未发现企业因涉嫌虚增贸易等原因被海关统计处置的情形。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否因虚增贸易被统计处置'
              ]
              },
            {
                id: 'C-LC14',
                officialId: '(27)',
                name: '管理要求-提供虚假情况',
                desc: '1年内未向海关提供虚假情况或隐瞒事实',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '1年内海关未发现企业向海关提供虚假情况或者隐瞒事实。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否向海关提供虚假情况'
              ]
              },
            {
                id: 'C-LC15',
                officialId: '(28)',
                name: '管理要求-抗拒执法',
                desc: '1年内无抗拒阻碍海关执法',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '1年内海关未发现企业抗拒、阻碍海关工作人员依法执行职务。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否抗拒阻碍海关执法'
              ]
              },
            {
                id: 'C-LC16',
                officialId: '(29)',
                name: '管理要求-毁弃资料',
                desc: '1年内无转移隐匿篡改毁弃账簿单证',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '1年内海关未发现企业转移、隐匿、篡改、毁弃账簿、报关单证以及与进出口直接相关的资料。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否转移隐匿篡改毁弃相关资料'
              ]
              },
            {
                id: 'C-LC17',
                officialId: '(30)',
                name: '管理要求-拒绝提供资料',
                desc: '1年内无拒绝拖延向海关提供资料',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '企业承诺书',
                standard: '1年内海关未发现企业拒绝、拖延向海关提供账簿、报关单证以及与进出口直接相关的资料。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否拒绝拖延向海关提供资料'
              ]
              },
            {
                id: 'C-LC18',
                officialId: '(31)',
                name: '管理要求-责令改正',
                desc: '1年内无被海关责令限期改正未按要求改正',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '海关责令改正通知',
                standard: '1年内海关未发现企业被海关责令限期改正，但未按海关要求改正。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否被海关责令改正但未按要求改正'
              ]
              },
            {
                id: 'C-LC19',
                officialId: '(32)',
                name: '管理要求-检疫处理',
                desc: '1年内无不履行检疫处理等义务',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '检疫处理履行记录',
                standard: '1年内海关未发现企业被海关责令或者要求履行检疫处理、技术整改、退运、销毁、采取风险消减措施等义务，但未按要求履行。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否被要求但未履行检疫处理等义务'
              ]
              },
            {
                id: 'C-LC20',
                officialId: '(33)',
                name: '管理要求-书面承诺',
                desc: '1年内无书面承诺未如实履行',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '书面承诺记录',
                standard: '1年内海关未发现企业向海关作出书面承诺，但未如实履行。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '1年内是否书面承诺未如实履行'
              ]
              },
            {
                id: 'C-LC21',
                officialId: '(34)',
                name: '管理要求-禁止行贿',
                desc: '1年内无向海关人员行贿',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '反商业贿赂声明',
                standard: '企业及所属人员，为企业办理海关业务的委托代理人员或者其他相关人员向海关人员行贿。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '企业及人员是否向海关人员行贿'
              ]
              }
          ]
          },
          {
            name: '16. 海关信用',
            items: [
            {
                id: 'C-LC22',
                officialId: '(35)',
                name: '海关信用-其他企业任职',
                desc: '相关人员任职的其他企业未被认定为失信企业',
                dept: 'HR',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '任职企业信用查询记录',
                standard: '企业相关人员以法定代表人（主要负责人）或者财务负责人、关务负责人、报关人员身份任职的其他企业未被海关认定为失信企业或者严重失信企业。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '相关人员任职的其他企业是否被认定为失信企业'
              ]
              },
            {
                id: 'C-LC23',
                officialId: '(36)',
                name: '海关信用-分支机构',
                desc: '分支机构未被认定为失信企业',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '分支机构信用查询记录',
                standard: '企业的分支机构、分支机构所属企业以及其他分支机构未被海关认定为失信企业或者严重失信企业。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '分支机构是否被认定为失信企业'
              ]
              },
            {
                id: 'C-LC24',
                officialId: '(37)',
                name: '海关信用-出资人',
                desc: '出资人未被认定为失信企业',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '出资人信用查询记录',
                standard: '企业在市场监管部门备案的出资人未被海关认定为失信企业或者严重失信企业。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '出资人是否被认定为失信企业'
              ]
              }
          ]
          },
          {
            name: '17. 外部信用',
            items: [
            {
                id: 'C-LC25',
                officialId: '(38)',
                name: '外部信用-公共信用',
                desc: '国家公共信用综合评价B以上',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '公共信用评价报告',
                standard: '国家公共信用综合评价为B以上。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '公共信用综合评价是否为B以上'
              ]
              },
            {
                id: 'C-LC26',
                officialId: '(39)',
                name: '外部信用-信用中国公示',
                desc: '企业及人员无严重失信信息在信用中国公示',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '信用中国查询记录',
                standard: '企业及企业相关人员无严重失信信息在"信用中国"网站处于公示状态。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '企业和人员在信用中国是否有严重失信公示信息'
              ]
              },
            {
                id: 'C-LC27',
                officialId: '(40)',
                name: '外部信用-出资人信用中国',
                desc: '出资人无严重失信信息在信用中国公示',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '出资人信用中国查询记录',
                standard: '企业在市场监管部门备案的出资人无严重失信信息在"信用中国"网站处于公示状态。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '出资人是否在信用中国有严重失信公示信息'
              ]
              },
            {
                id: 'C-LC28',
                officialId: '(41)',
                name: '外部信用-最低信用等级',
                desc: '企业及出资人未被公示为最低信用等级',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '信用等级查询记录',
                standard: '企业及其在市场监管部门备案的出资人未在"信用中国"网站被公示为国家相关部门评定的最低信用等级。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '企业和出资人是否被公示为最低信用等级'
              ]
              }
          ]
          }
      ]
    },

    security: {
      title: '贸易安全',
      icon: 'shield-alt',
      color: 'amber',
      subcategories: [
          {
            name: '18. 经营场所安全',
            items: [
            {
                id: 'C-TS01',
                officialId: '(42)',
                name: '场所安全-设施管控',
                desc: '场所具有设施防止未授权进入',
                dept: '行政部',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '场所安全制度+检查记录',
                standard: '根据业务模式和风险防范需要，对经营场所安全进行管控。经营场所应当具有相应设施防止未载明货物、物品和未经许可人员进入。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '场所是否有防止未授权进入的设施'
              ]
              },
            {
                id: 'C-TS02',
                officialId: '(43)',
                name: '场所安全-门窗围墙',
                desc: '窗户/大门/围墙锁闭或监控保护',
                dept: '行政部',
                supportDept: '',
                frequency: '每月',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '锁闭装置检查记录',
                standard: '使用锁闭装置或者采取进出监控以及指纹、人脸识别等进出控制措施保护所有内外部窗户、大门和围墙的安全，实行钥匙发放与回收的登记管理或者进出权限的授予与取消管理。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '窗户/大门/围墙是否有锁闭或监控保护'
              ]
              },
            {
                id: 'C-TS03',
                officialId: '(44)',
                name: '场所安全-出入口控制',
                desc: '车辆人员进出控制和授权管理',
                dept: '行政部',
                supportDept: '',
                frequency: '每日',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '出入口控制记录',
                standard: '车辆、人员进出企业的出入口配备人员值守或者实施技术手段等措施进行控制。仅允许经正确识别和授权的人员、车辆和货物、物品进出。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '出入口是否有人员值守或技术控制'
              ]
              }
          ]
          },
          {
            name: '19. 人员安全',
            items: [
            {
                id: 'C-TS04',
                officialId: '(45)',
                name: '人员安全-员工档案',
                desc: '员工档案管理，敏感岗位专业背景',
                dept: 'HR',
                supportDept: '',
                frequency: '持续',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '员工花名册+档案',
                standard: '实施员工档案管理，具有动态的员工清单。安排具有专业背景的人员担任生物安全，进出口食品、化妆品安全，质量安全等相关岗位管理人员。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否有动态员工清单',
                '敏感岗位人员是否具有专业背景'
              ]
              },
            {
                id: 'C-TS05',
                officialId: '(46)',
                name: '人员安全-访客管理',
                desc: '访客身份识别和进出登记管理',
                dept: '行政部',
                supportDept: '',
                frequency: '每日',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '访客登记记录',
                standard: '对访客进行身份识别和进出登记管理。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '访客是否有身份识别和进出登记'
              ]
              }
          ]
          },
          {
            name: '20. 货物、物品安全',
            items: [
            {
                id: 'C-TS06',
                officialId: '(47)',
                name: '货物安全-管控措施',
                desc: '保证货物运输装卸存储中的完整性安全性',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '货物安全管理制度',
                standard: '企业及其进出口活动中负有货物、物品安全责任的商业伙伴能够采取适当措施保证货物、物品在其管控期间的完整性、安全性，以及在运输、装卸和存储过程中能够实施有效管控。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '货物是否有安全管控措施'
              ]
              },
            {
                id: 'C-TS07',
                officialId: '(48)',
                name: '货物安全-封条管理',
                desc: '封条登记管理',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '封条管理制度+领用登记',
                standard: '封条有专人管理和登记，使用符合或者超出现行PAS ISO 17712高度安全封条标准的智能安全封条或者机械封条。明确施加封条的流程和封条异常的处置流程，留存施加封条的照片或者视频。无法使用封条的，应当采取适当方式保护货物、物品的安全。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '封条是否有专人管理和登记'
              ]
              },
            {
                id: 'C-TS08',
                officialId: '(49)',
                name: '货物安全-交接确认',
                desc: '装运和接收流程明确，交接确认措施',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '交接确认记录',
                standard: '明确装运和接收的流程和要求，确保货物、物品与进出口单证信息相符。对运抵的货物、物品核实其标签、数量和重量，对离岸的货物、物品核实购货订单或者装运订单上的内容。在货物、物品关键交接环节实施签名、盖章或者其它确认措施。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '装运和接收环节是否有交接确认措施'
              ]
              },
            {
                id: 'C-TS09',
                officialId: '(50)',
                name: '货物安全-木质包装',
                desc: '申报前核实木质包装IPPC标识',
                dept: '关务部',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '木质包装核实记录',
                standard: '申报前对进境货物是否使用木质包装进行核实，确认使用具有有效的国际植物保护公约专用标识的木质包装；出境货物使用木质包装的，申报前应确认其已经按要求实施除害处理并加施专用标识。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '木质包装IPPC标识是否核实'
              ]
              },
            {
                id: 'C-TS10',
                officialId: '(51)',
                name: '货物安全-出口监装',
                desc: '出口货物实施监装并拍照视频留存',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '监装记录+照片/视频',
                standard: '对出口货物、物品实施监装，对装货过程进行拍照或者视频留存。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '出口货物是否实施监装'
              ]
              }
          ]
          },
          {
            name: '21. 运输工具安全',
            items: [
            {
                id: 'C-TS11',
                officialId: '(52)',
                name: '运输工具安全-管控措施',
                desc: '保证运输工具完整性安全性的管控措施',
                dept: '物流/仓储',
                supportDept: '',
                frequency: '每单',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '运输工具安全管理制度',
                standard: '企业及其进出口活动中负有运输工具安全责任的商业伙伴能够采取适当的措施保证运输工具的完整性、安全性，以及在运输、装卸和存储过程中能够实施有效管控。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '运输工具安全管控措施是否到位'
              ]
              },
            {
                id: 'C-TS12',
                officialId: '(53)',
                name: '运输工具安全-停放看守',
                desc: '无人看管运输工具的安全防范',
                dept: '行政部',
                supportDept: '',
                frequency: '每日',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '运输工具停放管理制度',
                standard: '在责任范围内，采取适当措施对无人看管的运输工具进行安全防范，并在返回时检查运输工具是否存在安全隐患。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '无人看管运输工具是否有安全防范措施'
              ]
              }
          ]
          },
          {
            name: '22. 商业伙伴安全',
            items: [
            {
                id: 'C-TS13',
                officialId: '(54)',
                name: '商业伙伴安全-资质审核',
                desc: '签订合同前审核商业伙伴资质和守法合规',
                dept: '采购部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '商业伙伴审核记录',
                standard: '在签订合同、协议前，审核与进出口活动相关的国内商业伙伴的业务资质以及守法合规等情况，并在执行合同、协议过程中动态关注商业伙伴相关情况。商业伙伴为海关高级认证企业或者认证企业的，企业可免于审核相关情况；商业伙伴中有失信企业或者严重失信企业，但未动态关注且采取相应措施的，视为不达标。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '签订合同前是否审核商业伙伴资质'
              ]
              },
            {
                id: 'C-TS14',
                officialId: '(55)',
                name: '商业伙伴安全-动态名单',
                desc: '完整动态的商业伙伴名单',
                dept: '采购部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '商业伙伴名单',
                standard: '具有完整、动态的商业伙伴名单。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '商业伙伴名单是否完整和动态更新'
              ]
              }
          ]
          },
          {
            name: '23. 贸易安全培训',
            items: [
            {
                id: 'C-TS15',
                officialId: '(56)',
                name: '贸易安全培训',
                desc: '对相关岗位开展贸易安全培训',
                dept: 'HR',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '培训计划+培训记录',
                standard: '根据业务模式，采取适当方式对相关岗位员工以及委托代理企业开展相关培训，让员工以及委托代理企业了解并掌握在识别并报告可疑事件、防范潜在内部安全威胁以及保障货物、物品安全等方面应做的工作。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否对相关岗位开展贸易安全培训'
              ]
              }
          ]
          },
          {
            name: '24. 加分标准',
            items: [
            {
                id: 'C-BN01',
                officialId: '(57)',
                name: '绿色工厂/供应链',
                desc: '国家级绿色工厂或绿色供应链管理企业',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '认定证书',
                standard: '国家级绿色工厂或者绿色供应链管理企业。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否为国家级绿色工厂或绿色供应链'
              ]
              },
            {
                id: 'C-BN02',
                officialId: '(58)',
                name: '专精特新小巨人',
                desc: '国家级专精特新"小巨人"企业',
                dept: '总经办',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '认定证书',
                standard: '国家级专精特新"小巨人"企业。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否为国家级专精特新小巨人企业'
              ]
              },
            {
                id: 'C-BN03',
                officialId: '(59)',
                name: '企业技术中心',
                desc: '企业技术中心（国家级）',
                dept: '技术部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '认定文件',
                standard: '企业技术中心（国家级）。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否被认定为国家企业技术中心'
              ]
              },
            {
                id: 'C-BN04',
                officialId: '(60)',
                name: '海关统计样本',
                desc: '海关法定统计调查项目样本企业',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '样本企业证明',
                standard: '海关法定统计调查项目的样本企业，并且按照海关要求真实、准确、完整、及时提交统计调查所需的资料。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '是否被选为海关统计样本企业'
              ]
              },
            {
                id: 'C-BN05',
                officialId: '(61)',
                name: '委托报关企业信用',
                desc: '委托的报关企业全部为高级认证或认证企业',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '报关企业信用等级清单',
                standard: '申请认证企业的，1年内委托的报关企业信用等级全部为高级认证企业或者认证企业；已经成为认证企业的，复核周期内委托的报关企业信用等级全部为高级认证企业或者认证企业。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '委托的报关企业是否全部为高级认证或认证企业'
              ]
              },
            {
                id: 'C-BN06',
                officialId: '(62)',
                name: '关务水平评估',
                desc: '报关人员通过关务水平评估',
                dept: '关务部',
                supportDept: '',
                frequency: '每年',
                evidence: { policy: false, record: false, approval: false },
                evidenceDesc: '关务水平评估证书',
                standard: '企业所属报关人员全部通过海关认可的初级关务水平评估，或者企业所属报关人员中通过海关认可的中级关务水平评估的人数占比达到20%以上，或者企业所属报关人员中通过海关认可的高级关务水平评估的人数占比达到5%以上（至少1人）。企业所属报关人员不足5人的不适用本项标准。',
                checkFile: '',
                checkInterview: '',
                checkSite: '',
                checkRandom: '',
                sampleDocs: [],
                checkPoints: [
                '报关人员是否通过关务水平评估'
              ]
              }
          ]
          }
      ]
    }
  }
};


// =======================================================================
// 海关高级认证企业单项标准（22项 × 4个业务类型）
// 来源：附件4《海关高级认证企业标准》（单项标准）
// 当企业涉及对应业务类型时，这些标准作为补充认证依据
// =======================================================================
var INDIVIDUAL_STANDARDS = {
  healthQuarantine: {
    title: '进出境卫生检疫业务',
    icon: 'user-md',
    color: 'teal',
    items: [
      { id: 'IS-HQ-01', name: '特殊货物检验检疫业务资质', desc: '3年内每年有进出口特殊货物、物品业务，企业实验室取得备案资质且从事实验室相关活动3年以上。', dept: '质量管理部门/实验室', supportDept: '进出口部门', frequency: '持续', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '特殊货物/物品进出口记录、实验室备案资质证书、实验室活动记录', standard: '进出境卫生检疫业务 — 3年内每年有进出口特殊货物、物品业务，企业实验室取得备案资质且从事实验室相关活动3年以上。', checkFile: '检查实验室备案资质证书、特殊货物进出口清单、实验室活动台账', checkInterview: '询问实验室负责人资质情况、特殊货物操作流程', checkSite: '查看实验室现场、特殊货物存储区域', checkRandom: '抽查近3年特殊货物进出口记录', sampleDocs: ['实验室备案资质证书', '特殊货物进出口清单', '实验室活动记录台账'], checkPoints: ['企业是否有特殊货物进出口业务', '实验室是否取得备案资质', '实验室活动是否满3年以上', '特殊货物进出口记录是否完整'] },
      { id: 'IS-HQ-02', name: '国境卫生检疫行政处罚限制', desc: '进出口货物收发货人1年内违反国境卫生检疫相关法律、行政法规、规章被海关行政处罚不超过1次。', dept: '合规部门/关务部门', supportDept: '法务部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '海关行政处罚记录查询、合规检查记录', standard: '进出口货物收发货人1年内违反国境卫生检疫相关法律、行政法规、规章被海关行政处罚不超过1次。', checkFile: '检查行政处罚查询记录、合规检查台账', checkInterview: '询问关务负责人合规管理情况', checkSite: null, checkRandom: '抽查近1年海关处罚记录', sampleDocs: ['海关行政处罚查询记录', '合规检查台账', '内部整改报告'], checkPoints: ['近1年内卫生检疫处罚是否超过1次', '处罚后是否及时整改', '是否有合规检查制度'] },
      { id: 'IS-HQ-03', name: '特殊货物检验检疫不合格率', desc: '进出口货物收发货人1年内进出口特殊货物、物品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的1%。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '检验检疫结果记录、不合格批次统计表', standard: '进出口货物收发货人1年内进出口特殊货物、物品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的1%。', checkFile: '检查检验检疫结果记录、不合格批次统计表', checkInterview: '询问质量负责人不合格处理流程', checkSite: null, checkRandom: '抽查近1年检验检疫不合格批次', sampleDocs: ['检验检疫结果通知单', '不合格批次统计台账', '报关单清单'], checkPoints: ['不合格次数是否≤3次或≤1%', '不合格情况是否及时处理', '是否有预防纠正措施'] },
      { id: 'IS-HQ-04', name: '报关企业代理特殊货物不合格率', desc: '报关企业1年内代理进出口特殊货物、物品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的1%。', dept: '报关业务部门', supportDept: '质量管理部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '代理报关特殊货物检验检疫结果记录、不合格统计', standard: '报关企业1年内代理进出口特殊货物、物品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的1%。', checkFile: '检查代理报关特殊货物检验检疫结果记录', checkInterview: '询问报关业务负责人代理操作流程', checkSite: null, checkRandom: '抽查近1年代理报关记录', sampleDocs: ['代理报关记录', '检验检疫结果通知单', '不合格批次统计'], checkPoints: ['不合格次数是否≤3次或≤1%', '代理报关审核流程是否完善', '不合格情况是否与客户沟通'] },
      { id: 'IS-HQ-05', name: '特殊货物审批合规', desc: '2年内无以欺骗、贿赂等非法手段骗取特殊货物、物品审批单的情形。', dept: '合规部门', supportDept: '法务部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '审批单申请记录、合规承诺书', standard: '2年内无以欺骗、贿赂等非法手段骗取特殊货物、物品审批单的情形。', checkFile: '检查特殊货物审批单申请记录', checkInterview: '询问合规负责人审批流程', checkSite: null, checkRandom: '抽查特殊货物审批单', sampleDocs: ['特殊货物审批单台账', '企业合规承诺书'], checkPoints: ['是否有骗取审批单情形', '审批流程是否规范', '是否有合规审查机制'] }
    ]
  },
  plantQuarantine: {
    title: '进出境动植物检疫业务',
    icon: 'leaf',
    color: 'green',
    items: [
      { id: 'IS-PQ-01', name: '动植物检疫行政处罚限制', desc: '进出口货物收发货人1年内违反动植物检疫有关法律、行政法规、规章规定被海关行政处罚不超过2次。', dept: '合规部门/关务部门', supportDept: '法务部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '海关行政处罚查询记录、合规检查台账', standard: '进出口货物收发货人1年内违反动植物检疫有关法律、行政法规、规章规定被海关行政处罚不超过2次。', checkFile: '检查行政处罚查询记录', checkInterview: '询问关务负责人动植物检疫合规情况', checkSite: null, checkRandom: '抽查近1年海关处罚记录', sampleDocs: ['海关行政处罚查询记录', '合规检查台账'], checkPoints: ['近1年内动植物检疫处罚是否超过2次', '处罚后整改是否到位'] },
      { id: 'IS-PQ-02', name: '动植物检疫不合格率', desc: '进出口货物收发货人1年内进出口动植物、动植物产品和其他检疫物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过5次或者不超过检查批次（报关单票数）的5%。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '动植物检疫结果记录、不合格批次统计', standard: '进出口货物收发货人1年内进出口动植物、动植物产品和其他检疫物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过5次或者不超过检查批次（报关单票数）的5%。', checkFile: '检查动植物检疫结果记录、不合格统计表', checkInterview: '询问质量负责人不合格处理情况', checkSite: null, checkRandom: '抽查近1年检疫不合格批次', sampleDocs: ['检疫结果通知单', '不合格批次统计台账'], checkPoints: ['不合格次数是否≤5次或≤5%', '不合格处理流程是否规范'] },
      { id: 'IS-PQ-03', name: '报关企业代理动植物检疫不合格率', desc: '报关企业1年内代理进出口动植物、动植物产品和其他检疫物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过5次或者不超过检查批次（报关单票数）的5%。', dept: '报关业务部门', supportDept: '质量管理部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '代理动植物检疫结果记录、不合格统计', standard: '报关企业1年内代理进出口动植物、动植物产品和其他检疫物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过5次或者不超过检查批次（报关单票数）的5%。', checkFile: '检查代理报关动植物检疫结果记录', checkInterview: '询问报关业务负责人代理检疫情况', checkSite: null, checkRandom: '抽查近1年代理检疫记录', sampleDocs: ['代理报关记录', '检疫结果通知单'], checkPoints: ['不合格率是否≤5次或≤5%', '代理报检流程是否规范'] },
      { id: 'IS-PQ-04', name: '检疫单证合规', desc: '2年内无伪造、变造进出境动植物检疫单证、印章、标志、封识被海关行政处罚的情形。', dept: '合规部门', supportDept: '法务部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '检疫单证使用记录、合规承诺书', standard: '2年内无伪造、变造进出境动植物检疫单证、印章、标志、封识被海关行政处罚的情形。', checkFile: '检查检疫单证使用记录', checkInterview: '询问合规负责人单证管理', checkSite: null, checkRandom: '抽查检疫单证', sampleDocs: ['检疫单证领用台账', '企业合规承诺书'], checkPoints: ['是否有伪造变造检疫单证情形', '单证管理制度是否完善'] },
      { id: 'IS-PQ-05', name: '熏蒸消毒合规', desc: '2年内无不按照规定进行熏蒸或者消毒处理被取消熏蒸或者消毒资格的情形。', dept: '质量管理部门', supportDept: '仓储部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '熏蒸消毒记录、资质证书', standard: '2年内无不按照规定进行熏蒸或者消毒处理被取消熏蒸或者消毒资格的情形。', checkFile: '检查熏蒸消毒记录和资质', checkInterview: '询问熏蒸消毒操作人员', checkSite: '查看熏蒸消毒设备和场所', checkRandom: '抽查熏蒸消毒操作记录', sampleDocs: ['熏蒸消毒操作台账', '熏蒸消毒资质证书'], checkPoints: ['熏蒸消毒是否按规定操作', '是否有资质被取消情形'] },
      { id: 'IS-PQ-06', name: '出境注册登记合规', desc: '2年内无出口动植物、动植物产品和其他检疫物经检疫不合格被注销注册登记的情形。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '出口注册登记记录、检疫结果', standard: '2年内无出口动植物、动植物产品和其他检疫物经检疫不合格被注销注册登记的情形。', checkFile: '检查出口注册登记证明和检疫记录', checkInterview: '询问质量负责人出境注册登记情况', checkSite: null, checkRandom: '抽查出口检疫记录', sampleDocs: ['出境注册登记证书', '出口检疫合格证明'], checkPoints: ['是否有注销注册登记情形', '出口检疫不合格是否整改'] },
      { id: 'IS-PQ-07', name: '出口产品境外通报合规', desc: '2年内出口动植物、动植物产品和其他检疫物未因企业自身问题被进口国（地区）主管当局通报。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '出口产品境外通报记录、客户反馈', standard: '2年内出口动植物、动植物产品和其他检疫物未因企业自身问题被进口国（地区）主管当局通报。', checkFile: '检查境外通报记录', checkInterview: '询问质量负责人境外通报情况', checkSite: null, checkRandom: '抽查出口产品质量记录', sampleDocs: ['出口产品质量记录', '客户反馈记录'], checkPoints: ['是否有境外通报记录', '产品质量是否持续合格'] }
    ]
  },
  foodCosmetics: {
    title: '进出口食品、化妆品业务',
    icon: 'utensils',
    color: 'rose',
    items: [
      { id: 'IS-FC-01', name: '食品化妆品行政处罚限制', desc: '进出口货物收发货人1年内违反进出口食品、化妆品有关法律、行政法规、规章规定被海关行政处罚不超过2次。', dept: '合规部门/关务部门', supportDept: '法务部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '海关行政处罚查询记录、合规检查台账', standard: '进出口货物收发货人1年内违反进出口食品、化妆品有关法律、行政法规、规章规定被海关行政处罚不超过2次。', checkFile: '检查行政处罚查询记录', checkInterview: '询问关务负责人食品化妆品合规情况', checkSite: null, checkRandom: '抽查近1年海关处罚记录', sampleDocs: ['海关行政处罚查询记录', '合规检查台账'], checkPoints: ['近1年内食品化妆品处罚是否超过2次', '处罚后是否整改'] },
      { id: 'IS-FC-02', name: '食品化妆品检验检疫不合格率', desc: '进出口货物收发货人1年内进出口食品、化妆品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的2%。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '食品化妆品检验检疫结果记录、不合格批次统计', standard: '进出口货物收发货人1年内进出口食品、化妆品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的2%。', checkFile: '检查检验检疫结果记录', checkInterview: '询问质量负责人不合格处理', checkSite: '查看不合格品处理区域', checkRandom: '抽查近1年不合格批次', sampleDocs: ['检验检疫结果通知单', '不合格品处理台账'], checkPoints: ['不合格次数是否≤3次或≤2%', '不合格品处理是否合规'] },
      { id: 'IS-FC-03', name: '报关企业代理食品化妆品不合格率', desc: '报关企业1年内代理进出口食品、化妆品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的2%。', dept: '报关业务部门', supportDept: '质量管理部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '代理食品化妆品检验检疫结果记录、不合格统计', standard: '报关企业1年内代理进出口食品、化妆品海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的2%。', checkFile: '检查代理报关食品化妆品检验记录', checkInterview: '询问报关业务负责人代理操作', checkSite: null, checkRandom: '抽查近1年代理记录', sampleDocs: ['代理报关记录', '检验检疫结果通知单'], checkPoints: ['不合格率是否≤3次或≤2%', '代理申报审核是否严格'] },
      { id: 'IS-FC-04', name: '食品化妆品检疫单证合规', desc: '2年内无伪造、变造进出口食品、化妆品检验检疫单证、印章、标志、封识被海关行政处罚的情形。', dept: '合规部门', supportDept: '法务部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '单证使用记录、合规承诺书', standard: '2年内无伪造、变造进出口食品、化妆品检验检疫单证、印章、标志、封识被海关行政处罚的情形。', checkFile: '检查检验检疫单证记录', checkInterview: '询问合规负责人单证管理', checkSite: null, checkRandom: '抽查食品化妆品检疫单证', sampleDocs: ['检疫单证台账', '企业合规承诺书'], checkPoints: ['是否有伪造变造情形', '单证管理制度是否完善'] },
      { id: 'IS-FC-05', name: '进口食品不良记录合规', desc: '2年内未被海关总署列入进口食品不良记录名单。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '进口食品不良记录查询结果', standard: '2年内未被海关总署列入进口食品不良记录名单。', checkFile: '检查海关总署不良记录查询结果', checkInterview: '询问质量负责人进口食品质量情况', checkSite: null, checkRandom: '抽查进口食品记录', sampleDocs: ['海关总署不良记录查询', '进口食品质量报告'], checkPoints: ['是否被列入不良记录名单', '进口食品质量管理是否到位'] },
      { id: 'IS-FC-06', name: '出口食品化妆品境外通报合规', desc: '2年内出口食品、化妆品未因企业自身问题被进口国（地区）主管当局通报。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '出口产品境外通报记录', standard: '2年内出口食品、化妆品未因企业自身问题被进口国（地区）主管当局通报。', checkFile: '检查出口产品境外通报记录', checkInterview: '询问质量负责人出口质量情况', checkSite: null, checkRandom: '抽查出口食品化妆品记录', sampleDocs: ['境外通报查询记录', '出口产品质量报告'], checkPoints: ['是否有境外通报记录', '出口产品质量是否达标'] }
    ]
  },
  commodityInspection: {
    title: '进出口商品检验业务',
    icon: 'flask',
    color: 'cyan',
    items: [
      { id: 'IS-CI-01', name: '商品检验行政处罚限制', desc: '进出口货物收发货人1年内违反进出口商品检验有关法律、行政法规、规章规定被海关行政处罚不超过2次。', dept: '合规部门/关务部门', supportDept: '法务部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '海关行政处罚查询记录', standard: '进出口货物收发货人1年内违反进出口商品检验有关法律、行政法规、规章规定被海关行政处罚不超过2次。', checkFile: '检查行政处罚查询记录', checkInterview: '询问关务负责人商品检验合规情况', checkSite: null, checkRandom: '抽查近1年海关处罚记录', sampleDocs: ['海关行政处罚查询记录', '合规检查台账'], checkPoints: ['近1年内商检处罚是否超过2次', '处罚后整改是否到位'] },
      { id: 'IS-CI-02', name: '商品检验不合格率', desc: '进出口货物收发货人1年内进出口货物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的3%。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '商检结果记录、不合格批次统计', standard: '进出口货物收发货人1年内进出口货物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的3%。', checkFile: '检查商检结果记录', checkInterview: '询问质量负责人不合格处理', checkSite: null, checkRandom: '抽查近1年不合格批次', sampleDocs: ['商检结果通知单', '不合格批次统计台账'], checkPoints: ['不合格次数是否≤3次或≤3%', '不合格处理是否及时'] },
      { id: 'IS-CI-03', name: '报关企业代理商品检验不合格率', desc: '报关企业1年内代理进出口货物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的3%。', dept: '报关业务部门', supportDept: '质量管理部门', frequency: '季度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '代理商检结果记录', standard: '报关企业1年内代理进出口货物海关检验检疫结果为不予出口、退运、销毁、没收、涉嫌违法移交等情况的累计次数不超过3次或者不超过检查批次（报关单票数）的3%。', checkFile: '检查代理报关商检结果记录', checkInterview: '询问报关业务负责人代理操作', checkSite: null, checkRandom: '抽查近1年代理记录', sampleDocs: ['代理报关记录', '商检结果通知单'], checkPoints: ['不合格率是否≤3次或≤3%', '代理申报审核是否规范'] },
      { id: 'IS-CI-04', name: '出口商品境外通报合规', desc: '2年内出口货物未因企业自身质量问题被进口国（地区）主管当局通报。', dept: '质量管理部门', supportDept: '进出口部门', frequency: '年度核查', evidence: { policy: false, record: false, approval: false }, evidenceDesc: '出口商品境外通报记录', standard: '2年内出口货物未因企业自身质量问题被进口国（地区）主管当局通报。', checkFile: '检查出口商品境外通报记录', checkInterview: '询问质量负责人出口质量情况', checkSite: null, checkRandom: '抽查出口商品质量记录', sampleDocs: ['境外通报查询记录', '出口商品质量报告'], checkPoints: ['是否有境外通报记录', '出口商品质量管理是否到位'] }
    ]
  }
};

// ========================================================================
// 辅助函数：将带子分类的结构展开为扁平 items 数组（兼容旧代码）
// ========================================================================
function flattenStandardsData(data) {
  var result = {};
  Object.keys(data).forEach(function(dimKey) {
    var dim = data[dimKey];
    var flatDim = {
      title: dim.title,
      icon: dim.icon,
      color: dim.color,
      subcategories: dim.subcategories,
      items: []
    };
    dim.subcategories.forEach(function(sc) {
      sc.items.forEach(function(it) {
        flatDim.items.push(it);
      });
    });
    result[dimKey] = flatDim;
  });
  return result;
}

// 生成向后兼容的 standardsData
var standardsData = {
  advanced: flattenStandardsData(FULL_STANDARDS.advanced),
  certified: flattenStandardsData(FULL_STANDARDS.certified)
};

// =======================================================================
// 南京海关AEO认证标准样本资料库
// 来源：南京海关AEO进出口收发货人高级认证内容.xlsx + 文档样本.zip
// 25项认证标准 × 157条样本链接 + 60份样本文件
// 结构：{序号: { n:名称, c:大类, s:关联标准ID数组, z:zip样本文件数组, l:Excel样本链接数组, t:海关标准原文 }}
// =======================================================================
var NJ_SAMPLES = {
  1: {n:"海关业务培训",c:"内部控制",s:["IC-01","IC-02","IC-03"],z:[{n:"企业内部培训制度.pdf",t:"PDF"},{n:"企业年度培训计划.pdf",t:"PDF"},{n:"企业内部培训记录.pdf",t:"PDF"},{n:"企业内部培训试卷.pdf",t:"PDF"},{n:"企业内部培训照片.JPG",t:"JPG"},{n:"企业法人授权委托书.pdf",t:"PDF"}],l:[{n:"样本1 企业内部培训制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211360/3430931/2020120410305124126.pdf"},{n:"样本2 企业年度培训计划",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211360/3430926/2020120410295281343.pdf"},{n:"样本3 企业内部培训记录",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211360/3430923/2020120410291668302.pdf"},{n:"样本4 企业内部培训试卷",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211360/3430920/2020120410281043120.pdf"},{n:"样本6 企业法人授权委托书",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211360/3430912/2020120410270979066.pdf"},{n:"样本5 企业内部培训照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211363/3430934/2020120410315015994.JPG"}],t:"建立并执行海关法律法规等相关规定的内部培训制度。1．建立以下书面文件并有效落实：企业内部培训制度的书面文件，应有海关法律法规等相关规定培训的内容。海关业务培训的书面文件。可以是关于海关单项业务培训制度的书面文件；也可以是企业根据认证标准中关于各个单项业务培训的要求，统一制定的企业综合性内部培训制度的书面文件。综合性培训制度中需要包含海关各单项业务培训的内容。2．海关业务培训情况：（1）负责海关法律法规等相关规定内部培训的具体部门（岗位）、人员及职责分工、人数等。（2）培训计划、方式、内容、频次、培训人员范围以及培训效果等。（3）针对与企业业务相关的海关法律法规等相关规定，尤其是近一年来海关出台的规章制度和规范性文件等进行培训的情况。（4）针对企业过往发生的申报差错、违法记录以及其他不规范行为进行专题分析、查找原因，并针对上述行为所涉及的海关法律法规等相关规定进行培训的情况。（5）配合海关认证人员了解员工参加内部业务培训情况，特别是从事进出口业务的员工参加内部业务培训情况及对相关业务涉及的海关法律法规、规章制度以及业务规范的了解及掌握情况。3．按照海关认证人员要求提供抽查记录：企业内部培训的历史记录。重新认证企业，自成为认证企业或者最近一次重新认证后每一年的培训记录。培训记录可以为纸本文档、电子文档、系统记录、照片、视频等，应包括培训老师、日期、地点、参训人员、培训内容以及培训材料。企业海关业务培训开展情况应与企业制度规定相符，并符合本项标准要求。二、法定代表人（负责人）、负责关务的高级管理人员、关务负责人、负责贸易安全的高级管理人员应当每年参加2次以上海关法律法规等相关规定的内部培训，及时了解、掌握相关管理规定。法定代表人（负责人）不参与企业日常经营管理，由其授权人员实际负责企业日常经营管理，并代替参加培训的，应有企业法定代表人（负责人）签署的书面授权文件。（1）法定代表人（负责人）、负责关务的高级管理人员、关务负责人、负责贸易安全的高级管理人员的姓名、职务及职责分工。法定代表人（负责人）不参与企业日常经营管理的，可以由其授权人员（实际负责企业日常经营管理）代替。（2）配合海关认证人员了解上述人员参加培训的具体情况，包括培训次数、培训内容、培训时间、参加人员范围和培训效果等，以及每个人对其自身工作职责涉及的进出口业务和海关相关规定的了解、掌握情况。法定代表人（负责人）、负责关务的高级管理人员、关务负责人、负责贸易安全的高级管理人员，上述每个人参加培训的历史记录。法定代表人（负责人）不参与企业日常经营管理的，由其授权人员（实际负责企业日常经营管理）代替参加培训的历史记录。企业培训开展情况应与企业制度规定相符，并符合本项标准要求。"},
  2: {n:"内部组织架构",c:"内部控制",s:["IC-01","IC-02"],z:[{n:"企业组织架构图.pdf",t:"PDF"},{n:"各部门职责分工文件.pdf",t:"PDF"},{n:"高级管理人员任命文件.pdf",t:"PDF"}],l:[{n:"样本1 企业组织架构图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211369/3430957/2020120410355514916.pdf"},{n:"样本2 各部门职责分工文件",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211369/3430949/2020120410345617961.pdf"},{n:"样本3 高级管理人员任命文件",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211369/3430942/2020120410334943951.pdf"}],t:"一、进出口业务、财务、贸易安全、内部审计等部门（岗位）职责分工明确。1．建立以下书面文件并有效落实：企业组织架构图以及各部门（岗位）职责分工的书面文件。企业设置进出口业务、财务、贸易安全、内部审计等部门（岗位），各部门（岗位）的职责分工明确。2．内部组织架构情况：（1）进出口业务、财务、贸易安全、内部审计等部门的具体职责分工、管理架构、岗位设置、业务开展情况。（2）进出口业务、财务、贸易安全、内部审计等部门（岗位）管理人员的姓名、职位、职责，工作人员及职责分工、人数等。3．配合海关认证人员实地查看：进出口业务、财务、贸易安全、内部审计部门（岗位）业务实际开展情况。二、指定高级管理人员负责关务。企业高级管理人员的名单、职责分工的书面文件，书面文件中应明确指定某位高级管理人员负责关务。（1）企业高级管理人员的姓名、职位、职责分工等相关情况。（2）负责关务的高级管理人员的具体姓名、职位。（3）配合海关认证人员了解企业关务部门（岗位）的整体架构、业务范围、管理人员和业务人员及职责分工、内部管理和业务运行等情况。"},
  3: {n:"单证控制",c:"内部控制",s:["IC-05"],z:[{n:"进出口复核纸质草单.pdf",t:"PDF"},{n:"系统复核截图.GIF",t:"GIF"},{n:"进出口业务管理制度-初版190809.pdf",t:"PDF"}],l:[{n:"记录样本1 进出口复核纸质草单",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211378/3214479/2020083123033492479.pdf"},{n:"制度样本 进出口业务管理制度-初版190809",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211378/3214473/2020073116565217290.pdf"},{n:"记录样本2 系统复核截图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211381/3214483/2020073116573615610.GIF"}],t:"建立并执行进出口单证复核或者纠错制度。1．建立以下书面文件并有效落实：企业进出口单证复核或者纠错制度的书面文件，应有进出口单证复核或者纠错的规定，有责任部门（岗位）、工作流程、发现单证错误的处置及责任追究等内容。2．单证控制情况：（1）负责进出口单证复核或者纠错的具体部门（岗位）、人员及职责分工、人数等。（2）企业进出口单证复核或者纠错制度的落实情况，具体工作流程，发现问题如何处置；是否有责任追究，如何落实。（3）进出口单证复核或者纠错制度的执行成效，如：对提升企业单证规范申报水平，降低报关单删改数量，减少报关差错、因报关单证填报差错被行政处罚次数等的影响，以及进出口单证复核或者纠错制度实施前后的情况比较。3．按照海关认证人员要求提供抽查记录：（1）进出口单证复核或者纠错的工作记录。重新认证企业，自成为认证企业或者最近一次重新认证后每一年的工作记录。企业进出口单证复核或者纠错制度具体实施情况，以及在实际业务中落实成效，应与企业制度规定相符，并符合本项标准要求。4．配合海关认证人员实地查看：企业进出口单证复核或者纠错制度在实际进出口业务操作中的执行情况，复核或者纠错的具体工作流程，发现问题、错误的处置流程。"},
  4: {n:"单证保管",c:"内部控制",s:["IC-06"],z:[{n:"进口电子档保管截图.GIF",t:"GIF"},{n:"出口电子档案保管截图.GIF",t:"GIF"},{n:"档案室照片.html",t:"HTML"},{n:"档案室照片.jpg",t:"JPG"},{n:"纸质资料保管期限一览表.pdf",t:"PDF"},{n:"用印申请记录.pdf",t:"PDF"},{n:"认证书面档案保管截图.GIF",t:"GIF"},{n:"证照管理规定.pdf",t:"PDF"},{n:"进出口业务管理制度.pdf",t:"PDF"}],l:[{n:"记录样本4 纸质资料保管期限一览表 1",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211387/3214502/2020073116584936404.pdf"},{n:"记录样本5 用印申请记录",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211387/3214499/2020083123042945929.pdf"},{n:"制度样本1 证照管理规定",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211387/3214494/2020083123053373663.pdf"},{n:"制度样本2 进出口业务管理制度-初版190809（进出口单证，报关专用章管理，认证档案管理）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211387/3214490/2020073116580979666.pdf"},{n:"记录样本1 进口电子档保管截图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211390/3214532/2020073117005611709.GIF"},{n:"记录样本2 出口电子档案保管截图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211390/3214526/2020073117002836620.GIF"},{n:"记录样本3 档案室照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/dzbg79/zpyb9468/3214520/index.html"},{n:"记录样本6 认证书面档案保管截图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211390/3214511/2020073116593393884.GIF"}],t:"一、建立符合海关要求的进出口单证管理制度，确保归档信息的及时性、完整性、准确性与安全性。1．建立以下书面文件并有效落实：企业进出口单证管理制度的书面文件，应有关于进出口单证归档时限、归档要求、归档流程、归档复核等内容，以实现对进出口单证归档信息及时性、完整性、准确性和安全性的要求。2．单证保管情况：（1）企业关于进出口单证归档的管理规定，进出口单证归档负责部门（岗位），归档工作流程，对进出口单证归档要求，归档时限，负责归档文件保存、管理的部门。（2）企业负责保管进出口单证以及其它有关资料的具体部门（岗位）、人员及职责分工、人数等。（3）企业进出口单证存档管理的工作流程、存放的具体地点、存放保管方式，存放地点的安全性，必要的防火、防水、防盗等设备、设施，执行效果。3．按照海关认证人员要求提供抽查记录：企业归档保管的进出口单证资料。重新认证企业，自成为认证企业或者最近一次重新认证后每一年的进出口单证资料。企业进出口单证归档、保管情况应与企业制度规定相符，并符合本项标准要求。4．配合海关认证人员实地查看：企业进出口单证归档的具体做法和工作流程，单证保管场所情况，保障场所安全的必要设施的配备情况和实际运行、使用情况，进出口单证归档资料的保管情况。二、建立符合海关要求的特殊物品安全管理制度并按照规定留存特殊物品生产、使用、销售记录。对于从事特殊物品出入境的企业，认证以下内容，否则不适用本项标准。企业特殊物品生物安全管理体系的书面文件，应覆盖企业生产经营全过程的特殊物品生物安全管理规定，包括生产、使用、运输、保存、销售、销毁等各个环节，确保有特殊物品生物安全的管理岗位设置、岗位职责、操作要求、工作流程等内容。（1）企业特殊物品安全管理制度落实情况，包括在特殊物品生产、使用、运输、保存、销售、销毁等过程中，生物安全管理要求的落实情况，负责落实的具体岗位和职责、工作流程，以及工作记录的生成和保存情况。（2）负责留存特殊物品生产、使用、运输、保存、销售、销毁等安全管理记录的具体部门（岗位）、人员及职责分工、人数等。（3）企业特殊物品生产、使用、运输、保存、销售、销毁等安全管理记录档案管理的工作流程、存放的具体地点、保管方式，存放地点的安全性，必要的防火、防水、防盗等设备、设施，执行效果。出入境特殊物品生产、使用、运输、保存、销售、销毁等安全管理的有关工作记录。重新认证企业，自成为认证企业或者最近一次重新认证后每一年的记录。相关记录保存期限不少于2年。记录应与实际出入境特殊物品情况相符，与企业制度规定相符，并符合本项标准要求。（1）企业特殊物品安全管理制度实际落实情况，在各个生产作业环节的具体实施流程，实施的具体内容，负责实施的部门（岗位）、人员及职责分工，发现不符合安全管理制度情形的处置流程。（2）企业特殊物品生产、使用、运输、保存、销售、销毁等安全管理记录归档具体做法和工作流程，单证保管场所，保管情况。三、妥善管理报关专用印章、海关核发的证书、法律文书等单证。（1）报关专用章管理制度的书面文件，应包含报关专用章刻制、保管、使用等方面的管理内容。（2）海关核发的证书、法律文书等单证管理制度的书面文件，应包含上述单证的签收/领取、保管/存档、使用等方面的管理内容。（1）企业报关专用章刻制、保管、使用的相关规定。（2）企业的报关专用印章使用登记制度，以及使用情况登记记录。（3）企业对海关核发的证书、法律文书等单证的登记、统一保管、使用的相关规范。使用登记制度，以及使用情况登记记录。（4）保管的部门（岗位）、人员及职责分工，保存的地点、保存方式等。企业3年以来海关核发的证书、法律文书等单证。企业对单证的保管、使用情况，应与企业制度规定相符，并符合标准要求。（1）企业有报关专用印章的，查看报关专用章的管理部门（岗位）、人员，保管、使用制度落实情况，保管、使用记录。（2）企业有海关核发的证书、法律文书的，查看相关证书、法律文书的保管管理部门（岗位）、人员，保管、使用制度落实情况，保管、使用记录。四、建立企业认证的书面或者电子资料的专门档案。企业认证专门档案制度的书面文件，应有企业认证专门档案的有关管理内容，明确负责档案建立的部门（岗位）、人员及职责。负责企业认证工作的部门（岗位）、人员以及职责分工。（2）关务高级管理人员自身参与企业认证事宜的相关工作开展情况。（3）参与企业认证工作的部门（岗位），各部门（岗位）参与企业认证工作的人员、职务以及工作职责等情况。（4）负责企业认证工作的部门（岗位）工作开展情况。（5）根据实际经营管理情况、海关规范改进要求、《海关认证企业标准》等，更新企业认证档案的情况。企业认证书面或者电子资料档案，档案应当有目录清单。企业认证的书面或"},
  5: {n:"进出口活动",c:"内部控制",s:["IC-04"],z:[{n:"进出口活动文件清单.html",t:"HTML"},{n:"进出口活动文件清单.pdf",t:"PDF"},{n:"进出口活动文件清单.xlsx",t:"XLSX"}],l:[{n:"进出口活动文件清单",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jckhd62/wdyb1055/3430730/index.html"},{n:"样本5 企业内部培训照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211363/3430934/2020120410315015994.JPG"}],t:"建立并执行进出口活动的流程管理制度。1．建立以下书面文件并有效落实：企业进出口活动流程管理的书面文件。应有企业从事的各类型进出口活动流程管理的内容，应明确流程管理中岗位设置、岗位职责、管理要求等内容。2．进出口情况：（1）企业从事进出口业务的具体类型，如：直接从事货物、物品进出口，包括一般贸易、加工贸易、减免税设备、暂时进出境等；为进出口活动提供服务，包括报关、仓储、物流运输、检疫处理等；为进出境运输工具、人员提供服务，包括供油、供物料、供水、供餐食等。（2）企业根据从事进出口业务的具体类型，所制定的相应的流程管理制度。（3）企业进出口活动流程管理制度的具体实施情况，存在的问题和不足，采取的改进措施，实施成效。3．按照海关认证人员要求提供抽查记录：企业进出口活动的单证资料。重新认证企业，自成为认证企业或者最近一次重新认证后每一年的单证资料。4．配合海关认证人员实地查看：企业进出口活动流程管理制度，在企业实际业务操作中的具体实施情形，分别查看各个业务类型的流程管理制度的具体实施情形，包括每个业务类型的流程管理制度涉及的岗位设置、岗位职责、员工实际操作。企业具体操作应与管理制度规定相符。"},
  6: {n:"内审制度",c:"内部控制",s:["IC-10"],z:[{n:"海关AEO认证内部审计介绍.html",t:"HTML"},{n:"海关AEO认证内部审计介绍.mp4",t:"MP4"}],l:[{n:"海关AEO认证内部审计介绍",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/nbsjkz45/3249806/3249863/index.html"}],t:"一、建立并执行对进出口活动的内部审计制度。企业可以将本项标准中第（1）、（2）分项标准中对进出口活动的内部审计，与第（3）分项标准中对持续符合海关高级认证企业标准实施内部审计，统筹进行实施。1．建立以下书面文件并有效落实：企业内部审计制度的书面文件。应有对进出口活动实施内部审计的内容，应明确审计部门、每年审计次数、审计时间、审计程序、审计内容、引入外部审计、各部门配合、审计发现问题的规范改进以及改进后评估等内容。2．内部审计情况：（1）企业负责进出口活动内部审计的部门（岗位）、人员、人数及职责分工等。（2）企业每年开展内部审计的方案，次数，审计时间，一次内审用时。（3）审计涉及企业进出口业务范围，实施内部审计对进出口合规管理的帮助、提升。（4）最近一次内部审计情况，发现进出口活动存在的具体问题或者不足，以及规范改进情况。（5）聘请外部专职人员独立对进出口活动实施内部审计的，由负责对接外聘审计的人员介绍企业审计的具体情况：人数、资质、审计时间、方式、范围，审计发现问题，发现问题的规范改进情况，费用等。（6）配合海关认证人员了解内审制度的执行情况及执行效果。如：一般贸易是否按照进出口商品规范申报目录要求进行申报，涉及税收要素、许可证及监管证件、知识产权、特许权使用费、运保费等是否按照规定申报，是否按照规定委托或者接受委托申报等；加工贸易是否按照规定办理备案、核销、处置保税货物、残次品、边角料等；保税物流是否按照规定进行仓储、运输等；减免税货物是否按照海关规定使用或进行处置，抵押、移作他用等是否经海关批准；涉及卫生检疫、动植物检疫、进出口食品、法检商品等进出口活动的，是否按照规定管理等。（7）配合海关认证人员了解其配合内部审计所做的工作，审计发现问题或者不足后，相关部门规范改进情况，后续审计评估情况。二、每年实施1次以上的内部审计并建立书面或者电子资料的档案。1．内部审计情况：（1）实施进出口活动的内部审计的频次。（2）建立书面或者电子资料的内部审计档案的情况。（3）过往进出口活动内部审计开展情况，内审中发现的问题，问题的主要情况，对问题的规范改进情况，以及内审对强化内控的成效等。2．按照海关认证人员要求提供抽查记录：企业进出口活动内部审计档案材料（内审方案、计划，内审团队和人员分工，内审工作底稿、内审报告，内审发现的问题、规范改进建议、各部门针对审计发现问题的规范改进情况等）。重新认证企业，提供自成为认证企业或者最近一次重新认证后，每一年的进出口活动内部审计档案。企业对进出口活动的内部审计，应对企业全部进出口活动（包括各个类型海关监管业务）进行全面审计，对发现问题应进行规范改进，规范改进情况应与企业制度规定相符，并符合本项标准要求。3．配合海关认证人员实地查看：（1）内部审计部门（岗位）、人员日常工作开展情况。（2）对过往审计中发现问题和不足提出的规范改进建议，跟踪、督促各相关部门进行规范改进的情况，以及对规范改进效果评估的情况。三、已成为高级认证企业的，应当每年对持续符合海关高级认证企业标准实施内部审计。对于高级认证企业重新认证的，认证以下内容，否则不适用本项标准。（1）企业对持续符合海关高级认证企业标准实施内部审计的情况：对企业持续符合海关高级认证企业标准实施内部审计的频次，就持续符合认证标准的内审制定的审计方案、组建审计团队及内部分工，内审的时间、方式、范围，完成一次内审活动的时间等。（2）企业各部门（包括内审部门、关务部门等）参加海关认证培训、认证辅导（包括参加总署、直属海关、隶属海关组织的）的情况等。（3）配合海关认证人员了解其对海关高级认证标准的正确理解和有效落实的情况。（4）企业负责持续符合高级认证企业标准实施内部审计的人员情况及职责分工等。（5）对本企业适用的海关认证企业标准内容的了解和掌握情况。（6）聘请外部专职人员独立开展持续符合标准内部审计的，由负责对接外聘审计的人员现场配合认证人员了解审计的具体情况，包括外审机构名称、资质，外审人员人数、资质等。（7）内审的效果：发现企业存在不符合或者部分符合认证标准的具体情形、涉及企业的具体部门和具体业务。规范改进的措施或者方案、具体规范改进的实施情况。规范改进后续评估的情况。（8）配合海关认证人员了解其配合内部审计所做的工作。对审计发现问题制定、落实规范改进措施的情况，规范改进成效，配合进行后续评估的情况。提供自成为高级认证企业或者最近一次重新认证后，每一年对持续符合海关高级认证企业标准的内部审计档案：包括内审方案、计划，内审团队及职责分工，聘请的外部审计机构、外审人员及职责分工，内审工作底稿、审计发现问题及规范改进情况，规范改进后企业自我评估情况等。企业对持续符合海关高级认证企业标准的内部审计应与企"},
  7: {n:"质量管理",c:"内部控制",s:[],z:[{n:"质量管理文件清单.docx",t:"DOCX"}],l:[{n:"质量管理文件清单",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3506032/3506044/2021010814551899557.docx"}]},
  8: {n:"改进机制",c:"内部控制",s:["IC-11"],z:[{n:"改进机制文件清单.docx",t:"DOCX"}],l:[{n:"改进机制文件清单",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3506066/3506072/2021010814564348767.docx"}],t:"一、建立并执行对进出口活动中已发现问题的改进机制和违法行为的责任追究机制并有效落实。1．建立以下书面文件并有效落实：改进机制和责任追究机制的书面文件。应包括对进出口活动中已发现问题的改进和违法行为责任追究的内容，责任部门、岗位设置、岗位要求、工作流程，改进、责任追究方式和落实、评估等内容。2．改进机制情况：（1）企业对进出口活动中存在的问题、过往内部审计对进出口活动中已发现的问题进行分析，查找原因，制定规范改进方案或者措施情况，以及改进方案或者措施的实施结果。（2）企业过往发生的具体违法行为，以及对与违法行为有关的责任人员进行责任追究的情况。（3）配合海关认证人员了解问题改进和责任追究具体实施情况，以及有关成效。3．按照海关认证人员要求提供抽查记录：（1）企业发现问题、原因分析、实施问题改进的工作记录。重新认证企业，企业自成为认证企业或者最近一次重新认证后，每一年的工作记录。企业改进机制应有效落实，落实情况应与企业制度规定相符，并符合标准要求。（2）企业对违法行为相关责任人员实施责任追究的工作记录。企业违法行为的责任追究机制应有效落实，落实情况与企业制度规定相符，并符合标准要求。二、对海关要求的改正或者规范改进等事项，应当由法定代表人（负责人）或者负责关务的高级管理人员组织实施。改进机制和责任追究机制的书面文件。应明确对海关要求的改正或者规范改进等事项，由法定代表人（负责人）或者负责关务的高级管理人员组织实施，应有上述人员组织实施的工作流程、管理要求、改正或者规范改进措施落实及跟踪、成效评估等内容。（1）需要改正或者规范改进事项的具体内容。（2）组织实施改正或者规范改进的情况，包括分析查找原因、制定改正或者规范改进方案、措施，组织实施的情况以及成效。法定代表人（负责人）或者负责关务的高级管理人员组织实施改正或者规范改进事项的工作记录。海关要求事项的改正或者规范改进应由企业法定代表人（负责人）或者负责关务的高级管理人员组织实施，落实情况应与企业制度规定应相符，改正或者规范改进应达到海关要求，以及符合本项标准的要求。"},
  9: {n:"信息系统",c:"内部控制",s:["IC-08"],z:[{n:"系统穿行测试截图.docx",t:"DOCX"},{n:"系统分析功能截图.pdf",t:"PDF"},{n:"系统预警报错截图.docx",t:"DOCX"},{n:"信息系统使用手册.docx",t:"DOCX"}],l:[{n:"信息系统使用手册",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211414/3423408/信息系统使用手册.docx"},{n:"系统预警报错截图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211414/3423525/系统预警报错截图.docx"},{n:"系统分析功能截图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211414/3423503/系统分析功能截屏1.pdf"},{n:"系统穿行测试截图",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211414/3423447/报关单证作业系统处理流程（穿行测试截图）.docx"}],t:"具有管理企业生产经营活动的信息化系统。1．建立以下书面文件并有效落实：信息系统手册。企业信息化系统应能够实现对生产经营活动全过程管理。2．信息系统情况：（1）企业所具备的管理生产经营活动的信息化系统情况，信息化系统名称、上线使用时间，信息化系统的主要功能模块。是否能实现对企业生产经营活动全覆盖；如果未全覆盖，没有实现信息化系统管理的具体生产经营活动。（2）关务、采购、生产、物流、仓储、财务等部门负责人或者岗位员工应配合认证人员了解关务、采购、生产、物流、仓储、财务等部门应用信息化系统的情况，应用信息化系统的具体功能，包括对各部门全部生产经营活动进行管理和记录，实现进出口货物信息在企业信息化系统全流程记录、留痕、追溯、检索，信息化系统日常运行维护情况。3．配合海关认证人员实地查看：配合海关认证人员登录信息化系统，对信息化系统管理的企业生产经营活动及具体管理方式进行演示。确保企业生产经营活动通过信息化系统实现管理。确保信息化系统对企业生产经营活动实现管理的全覆盖，包括企业生产采购、仓储、生产过程、进出口等生产经营信息，财务信息，物流信息等。任意选取企业进出口货物，正向及反向追溯、检索，该进出口货物在企业信息化系统中各个环节信息的记录和流转情况。"},
  10: {n:"数据管理",c:"内部控制",s:["IC-08"],z:[{n:"机房物理设施.pdf",t:"PDF"},{n:"数据备份管理制度.pdf",t:"PDF"},{n:"信息系统数据管理制度.pdf",t:"PDF"}],l:[{n:"信息系统数据管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3423952/3425070/信息数据管理制度.pdf"},{n:"数据备份管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3423952/3425077/数据备份管理制度.pdf"},{n:"机房物理设施",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3423952/3425120/机房物理设施.pdf"}],t:"建立信息系统的数据管理制度，数据存储3年以上。1．建立以下书面文件并有效落实：企业生产经营数据管理的书面文件。应明确数据管理部门（岗位），数据容灾备份，数据安全管理，数据录入、存储和异常处理，档案资料保管等内容。2．数据管理情况：（1）企业数据管理的部门（岗位）、人员及职责分工。（2）配合海关认证人员了解对企业数据进行容灾备份的情况，备份数据存储情况。其他确保数据安全的措施，例如授权管理、数据分级管理和使用等。数据管理制度落实情况和成效。3．配合海关认证人员实地查看：（1）企业数据录入等操作。确保系统数据保存年限符合海关管理要求。（2）企业数据保存的机房，确保具备必要的防火、防水、防盗等设备、设施，可以阻止非授权人员进入和非法闯入、破坏。"},
  11: {n:"信息安全",c:"内部控制",s:["IC-09"],z:[{n:"信息安全管理制度.pdf",t:"PDF"},{n:"信息安全培训反馈意见表.doc",t:"DOC"},{n:"信息安全培训签到表.docx",t:"DOCX"}],l:[{n:"信息安全管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3423966/3425202/信息安全管理制度.pdf"},{n:"信息安全培训签到表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3423966/3425214/内部培训签到表.docx"},{n:"信息安全培训反馈意见表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3423966/3425211/内部培训反馈意见表.doc"}],t:"一、建立并执行信息安全管理制度。1．建立以下书面文件并有效落实：企业信息安全管理制度的书面文件。应明确信息安全管理部门（岗位）、信息安全责任、安全管理要求、信息系统日常运维保障、应急处置、系统定期更新、档案资料保管等内容。2．信息安全情况：（1）负责信息安全管理的具体部门（岗位）、人员、人数以及职责分工等。（2）配合海关认证人员了解信息安全职责、企业保障信息系统和数据的安全的具体措施。（3）过往是否发生过信息系统非连续、非正常运行等情况，如有，具体原因以及处置情况。（4）应由使用信息系统的员工现场配合认证人员了解其对信息安全管理相关制度的掌握情况及执行情况。3．按照海关认证人员要求提供抽查记录：企业过往发生信息安全事故或者系统故障的应急处置工作记录。重新认证企业，企业自成为认证企业或者最近一次重新认证后，每一年的处置记录。企业对信息安全落实情况应与企业制度规定相符，以及符合本项标准要求。4．配合海关认证人员实地查看：信息安全管理的负责人或者岗位人员演示，企业在保障信息安全方面采取的措施以及措施的实施成效。二、对员工进行信息安全相关的培训。对员工进行信息安全管理培训的书面文件。应明确对员工进行信息安全培训的部门、培训周期、内容确定、培训实施、效果评估、档案资料保管等内容。（1）信息安全教育和培训的具体部门（岗位）、人员、人数以及职责分工等。（2）配合海关认证人员了解其参加信息安全培训的情况，以及其掌握信息安全相关制度的情况。企业信息安全培训的历史记录。重新认证企业，企业自成为认证企业或者最近一次重新认证后，每一年的记录。企业提供的信息安全培训记录应与企业制度规定相符，并符合本项标准要求。三、对违反信息安全管理制度造成损害的行为应当予以责任追究。信息安全管理制度的书面文件。应明确责任追究部门（岗位）、工作职责，管理要求，责任追究的内容、方式、如何实施，档案资料保管等内容。（1）企业过往是否发生违反信息安全造成损害的行为，如有，具体情形以及处置情况。（2）是否能够发现和防止非法入侵和篡改数据，过往是否发现有企业信息化系统被非法侵入或者篡改数据的情事，如有，具体情形以及处置情况。企业对违反信息安全管理制度造成损害行为予以责任追究的相关记录。企业信息安全责任追究应有效落实，并符合标准要求。"},
  12: {n:"财务状况标准",c:"财务状况与守法规范",s:["FI-01","FI-02","FI-03","FI-04"],z:[{n:"财务计算公式样本.docx",t:"DOCX"},{n:"财务指标释义.html",t:"HTML"},{n:"财务指标释义.jpg",t:"JPG"},{n:"各行业财务指标评价标准值.jpg",t:"JPG"},{n:"审计报告-2.jpg",t:"JPG"},{n:"审计报告.html",t:"HTML"},{n:"审计报告.jpg",t:"JPG"}],l:[{n:"财务计算公式样本",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211423/3214577/2020073117051058478.docx"},{n:"财务指标释义",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/cwzkbz47/zpyb61/3214612/index.html"},{n:"各行业财务指标评价标准值",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211426/3214609/2020073117093347814.jpg"},{n:"审计报告",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/cwzkbz47/zpyb61/3214604/index.html"}],t:"1.会计信息。企业申请高级认证的，应当提交会计师事务所出具的无保留意见审计报告；高级认证企业复核的，企业应当提交最近一次认证或者复核后每一年度会计师事务所出具的无保留意见审计报告。2.资产负债率。无连续3年资产负债率超过95%情形（资产负债率=负债总额/资产总额, 负债总额、资产总额以审计报告后附的财务报表数据的期末值为准）。"},
  13: {n:"遵守法律法规",c:"财务状况与守法规范",s:["LC-01","LC-02","LC-03","LC-04","LC-05"],z:[{n:"自我申明（示例）.html",t:"HTML"},{n:"自我申明（示例）.png",t:"PNG"},{n:"无犯罪记录证明（示例）.html",t:"HTML"},{n:"无犯罪记录证明（示例）.png",t:"PNG"}],l:[{n:"公安机关出具的无犯罪记录证明（示例）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/3214626/3214627/3419516/index.html"},{n:"本人出具的由企业加盖公章的自我申明（示例）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/3214626/3214627/3419512/index.html"},{n:"样本5 企业内部培训照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211363/3430934/2020120410315015994.JPG"}],t:"人员守法：企业相关人员2年内未因故意犯罪受过刑事处罚。企业可以向海关提供以下任一证明材料：（1）公安机关出具的无犯罪记录证明。（2）政府部门认可的机构所出具的相关证明材料。（3）企业相关人员本人出具的由企业加盖公章并承担法律责任的自我申明。企业守法：（1）1年内被海关列入信用信息异常企业名录次数不超过1次，且不超过30日。（2）1年内无因进口禁止进境的固体废物违反海关监管规定被海关行政处罚的情形。（3）2年内无成为失信企业的情形。（4）企业2年内未因犯罪受过刑事处罚。"},
  14: {n:"进出口业务规范",c:"财务状况与守法规范",s:["LC-06","LC-07"],z:[],l:[],t:"注册信息：在海关的注册登记或者备案信息与实际相符。企业应配合海关认证人员在实地认证时核实企业在海关注册登记或者备案的信息是否与实际相符。进出口记录：2年内有进出口活动或者为进出口活动提供相关服务。由海关认定。企业应当配合海关了解相关情况。企业对海关认定有异议的，可以向海关说明情况，并提供相关证明材料。申报规范：见单项标准。见各单项标准指南传输规范：见单项标准。税款缴纳（1）认证期间，没有超过法定缴款期限尚未缴纳税款及罚没款项的情形。（2）上年度以及本年度1月至上月没有超过法定缴款期限缴纳税款的情形。"},
  15: {n:"海关管理要求",c:"财务状况与守法规范",s:["LC-08","LC-09","LC-10"],z:[],l:[],t:"（1）2年内无海关责令限期改正，但逾期不改正的情形。由海关认定。企业应当配合海关了解相关情况。企业对海关认定有异议的，可以向海关说明情况，并提供相关证明材料。（2）2年内无向海关提供虚假情况或者隐瞒事实的情形。（3）2年内无由海关要求承担技术处理、退运、销毁等义务，但逾期不履行的情形。（4）2年内无明知其产品存在风险未主动向海关报告相关信息，或者存在瞒报、漏报的情形。（5）2年内无拒绝、拖延向海关提供账簿、单证或海关归类、价格、原产地、减免税核查所需资料等有关材料的情形。（6）2年内无转移、隐匿、篡改、毁弃报关单证、进出口单证、合同、与进出口业务直接有关的其他资料的情形。（7）2年内无拒不配合海关执法的情形。（8）2年内无未按海关要求办理保金保函的延期、退转手续的情形。（9）2年内无向海关人员行贿的行为。（10）2年内无未按规定向海关报告减免税货物使用状况的情形。（11）2年内未发生因产品安全、卫生、环保、品质、检疫问题或者欺诈行为被国（境）外官方通报或客户退货、索赔造成不良影响，经查实确属企业责任的。（12）上年度商品安全、卫生、健康、环境保护、反欺诈、品质及数重量鉴定等项目指标被海关查验不合格率不超过同年度同类商品不合格率。（13）2年内出口动植物及其产品检验检疫、风险监控检测合格率99%以上。（14）2年内进口商未列入海关总署进口食品不良记录名单。"},
  16: {n:"外部信用",c:"财务状况与守法规范",s:["LC-11"],z:[{n:"国家企业信用信息公示系统(示例).html",t:"HTML"},{n:"国家企业信用信息公示系统(示例).png",t:"PNG"},{n:"企业信用信息公示报告(示例).html",t:"HTML"},{n:"企业信用信息公示报告(示例).jpg",t:"JPG"},{n:"企业未被列入失信名单自我申明（示例）.html",t:"HTML"},{n:"企业未被列入失信名单自我申明（示例）.pdf",t:"PDF"},{n:"相关人员未被列入失信名单自我申明（示例）.html",t:"HTML"},{n:"相关人员未被列入失信名单自我申明（示例）.pdf",t:"PDF"}],l:[{n:"企业相关人员未被列入国家失信联合惩戒名单自我申明（示例）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/hgywpx33/wdyb7278/3419555/index.html"},{n:"企业未被列入国家失信联合惩戒名单自我申明（示例）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/hgywpx33/wdyb7278/3419547/index.html"},{n:"国家企业信用信息公示系统企业信用信息公示报告(示例)",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/hgywpx33/wdyb7278/3419532/index.html"},{n:"国家企业信用信息公示系统(示例)",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/hgywpx33/wdyb7278/3419527/index.html"}],t:"企业和企业相关人员2年内均未被列入国家失信联合惩戒名单。由海关认定。企业应当配合海关了解相关情况。企业对海关认定有异议的，可以向海关说明情况，并提供相关证明材料。"},
  17: {n:"场所安全",c:"贸易安全",s:["SE-01","SE-02","SE-03","SE-04","SE-05"],z:[{n:"保安巡查记录表.pdf",t:"PDF"},{n:"场所安全改造照片.rar",t:"RAR"},{n:"场所及安保异常情况处置表.pdf",t:"PDF"},{n:"房屋水电及设施检查记录表.pdf",t:"PDF"},{n:"公司场所异常汇总表.pdf",t:"PDF"},{n:"摄像头日常点检表.pdf",t:"PDF"},{n:"视频监控调阅登记表.pdf",t:"PDF"},{n:"视频监控维修记录表.pdf",t:"PDF"},{n:"视频监控系统日常检查记录表.pdf",t:"PDF"},{n:"认证场景（视频监控设备）.docx",t:"DOCX"},{n:"突发事件登记表.pdf",t:"PDF"},{n:"贸易安全标准-场所安全.pdf",t:"PDF"},{n:"消防设施检查记录表.pdf",t:"PDF"},{n:"行政部月度巡检表.pdf",t:"PDF"},{n:"钥匙领用、退还登记表.pdf",t:"PDF"}],l:[{n:"保安巡查记录表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214780/2020081717255256074.pdf"},{n:"场所安全改造照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214777/2020073117251086984.rar"},{n:"场所及安保异常情况处置表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214773/2020081717260986428.pdf"},{n:"房屋水电及设施检查记录表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214770/2020081717262130458.pdf"},{n:"公司场所异常汇总表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214763/2020081717360386117.pdf"},{n:"行政部月度巡检表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214763/2020081717362577452.pdf"},{n:"摄像头日常点检表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214760/2020081717364371483.pdf"},{n:"视频监控调阅登记表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214757/2020081717371385285.pdf"},{n:"视频监控维修记录表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214754/2020081717373858731.pdf"},{n:"视频监控系统日常检查记录表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214751/2020081717380437095.pdf"},{n:"收发货人-高级认证认证场景（视频监控设备）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214748/2020073117222776280.docx"},{n:"突发事件登记表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214742/2020081717382213830.pdf"},{n:"文件—贸易安全标准-场所安全",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214738/2020120209374992243.pdf"},{n:"消防设施检查记录表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214735/2020081717385698759.pdf"},{n:"钥匙领用、退还登记表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211441/3214732/2020081717391846757.pdf"},{n:"样本5 企业内部培训照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211363/3430934/2020120410315015994.JPG"}],t:"一、建立并执行企业经营场所安全的管理制度。1．建立以下书面文件并有效落实：企业经营场所安全管理制度的书面文件，明确场所安全负责部门（岗位）、工作职责、管理要求、应急处置、档案资料保管等内容。2．场所安全情况：（1）负责企业经营场所安全管理的责任部门（岗位）。（2）配合海关认证人员了解其岗位职责及日常工作情况。二、企业经营场所应当具有相应设施防止未载明货物和未经许可人员进入。1．场所安全情况：（1）企业经营场所的出入口、内外窗户、围墙周边、停车场以及生产、货物装卸和存储区域等重点敏感区域设置防止未载明货物和未经许可人员进入的相应设施的情况。（2）相应设施的定期检查、维护情况。2．配合海关认证人员实地查看：确认相应设施正常使用。3．按照海关认证人员要求提供抽查记录：企业对相应设施定期检查、维护的相关记录。重新认证企业，抽查自成为认证企业或者最近一次重新认证后每一年的记录。企业对相应设施的检查维护应与企业制度规定相符，以及符合本项标准要求。"},
  18: {n:"进入安全",c:"贸易安全",s:["SE-06","SE-07"],z:[{n:"工牌发放回收登记表.pdf",t:"PDF"},{n:"入厂须知登记表.pdf",t:"PDF"},{n:"外来人员车辆出入登记表.pdf",t:"PDF"},{n:"贸易安全标准-进入安全.pdf",t:"PDF"},{n:"休假员工权限调整申请表.pdf",t:"PDF"}],l:[{n:"工牌（员工卡）发放回收登记表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211450/3214799/2020081717394987219.pdf"},{n:"入厂须知登记表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211450/3214792/2020081717401696198.pdf"},{n:"外来人员车辆出入登记表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211450/3214789/2020081717403053779.pdf"},{n:"文件—贸易安全标准-进入安全",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211450/3214786/2020120209384719701.pdf"},{n:"休假员工权限调整申请表（新）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211450/3214783/2020081717410661496.pdf"},{n:"样本5 企业内部培训照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211363/3430934/2020120410315015994.JPG"}],t:"一、建立并执行人员和车辆出入管理制度。1．建立以下书面文件并有效落实：人员和车辆出入管理制度的书面文件，明确进入安全责任部门（岗位）、工作职责、管理要求、应急处置、档案资料保管等内容。2．进入安全情况：（1）负责人员和车辆出入管理的责任部门（岗位）。（2）配合海关认证人员了解其岗位职责及日常工作情况。二、对企业员工进行身份识别和出入权限控制，限制未经授权员工进入敏感区域，对员工身份标识的发放和回收进行统一管理。员工的车辆进入企业应当停放在指定区域。员工出入管理的书面文件，明确责任部门（岗位）、工作职责、管理要求、应急处置、档案资料保管等内容。（1）负责员工身份标识、出入权限控制的责任部门（岗位）、人员、人数及职责等。（2）进行员工识别的方式，发生未佩戴员工身份标识或无法识别等异常情况时的处置措施。（3）进行员工出入权限控制的方式，发生员工擅自进入敏感区域等异常情况时的处置措施。（4）员工身份标识发放和回收的方式，发生员工身份标识遗失、损坏等异常情况的处置措施。3．按照海关认证人员要求提供抽查记录：企业记录员工身份标识的发放、更换、补发、回收记录。记录可以为纸本文档、系统记录等。重新认证企业，抽查自成为认证企业或者最近一次重新认证后每一年的记录。企业员工出入管理情况应与企业制度规定相符，以及符合本项标准要求。4．配合海关认证人员实地查看：（1）身份识别应当有员工的姓名、所在部门、照片等信息或者采取技术手段自动识别。（2）员工进入敏感区域出入权限控制的实际执行情况。（3）员工的车辆进入企业应当停放在指定区域。三、实行访客登记管理，登记时必须检查带有照片的身份证件。访客进入企业应当佩戴临时身份标识，进入企业重点敏感区域应当有企业内部人员陪同。访客的车辆进入企业应当登记并停放在指定区域。对访客登记管理的书面文件，明确责任部门（岗位）、工作职责、管理要求、应急处置、档案资料保管等内容。（1）负责访客登记管理的责任部门（岗位）、人员、人数以及职责分工。（2）访客登记的方式，发现访客未能提供带有照片的身份证件等异常情况时的处理措施。（3）访客登记记录的保存情况，保存方式、保存期限。（4）对访客登记执行情况的监督、抽查情况。（5）访客进入企业重点敏感区域的相关要求。（6）允许进入企业生产经营场所的访客车辆的登记、停放。（1）企业访客出入登记记录。应包括访客姓名、身份证件类型、来访时间、离开时间等信息。（2）企业访客临时身份标识发放与回收记录。（3）企业访客车辆的登记记录。应包含车辆号码、来访时间、离开时间等信息。记录可以为纸本文档、电子文档、系统记录等。企业员工访客登记管理情况应与企业制度规定相符，并符合本项标准要求。（1）访客登记的实际执行情况：包括检查证件、登记、通知内部人员、发放临时身份标识、回收临时身份标识等。（2）经营场所内没有访客未佩戴临时身份标识或者无内部人员陪同的情况。（3）访客车辆进入企业的登记情况，查看访客车辆停放区域。（4）调取过往监控记录查看访客、访客车辆出入的过程。四、对未经许可进入、身份不明的人员能够识别并加以处置。识别、处置未经许可进入、身份不明人员的书面文件，明确责任部门（岗位）、工作职责、管理要求、应急处置、档案资料保管等内容。（1）对未经许可进入、身份不明的人员进行识别的具体措施。（2）配合海关认证人员了解其对发生未经许可进入、身份不明人员闯入的处置措施。过往发生的未经许可进入、身份不明人员的情况（若有）以及处置结果。（3）配合海关认证人员了解企业员工对识别、发现可疑人员或恐怖分子的意识及处置措施的掌握情况。企业对未经许可进入、身份不明人员识别、处置的相关记录。企业对未经许可进入、身份不明的人员识别、处置情况应与企业制度规定相符，并符合本项标准要求。"},
  19: {n:"人员安全",c:"贸易安全",s:["SE-08","SE-09"],z:[{n:"人员离职资料.pdf",t:"PDF"},{n:"外部招聘制度.pdf",t:"PDF"},{n:"员工离职管理制度.pdf",t:"PDF"},{n:"员工招聘资料.pdf",t:"PDF"}],l:[{n:"人员离职资料",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211459/3214821/2020081717420734496.pdf"},{n:"外部招聘制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211459/3214818/2020081717422522271.pdf"},{n:"员工离职管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211459/3214815/2020081717424041320.pdf"},{n:"员工招聘资料",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211459/3214812/2020081717425567424.pdf"},{n:"样本5 企业内部培训照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211363/3430934/2020120410315015994.JPG"}],t:"一、建立并执行员工入职、离职停职等管理制度。1．建立以下书面文件并有效落实：员工入职、离职、停职等管理制度的书面文件，明确员工入职、离职、停职责任部门（岗位）、工作职责、管理要求、应急处置、档案资料保管等内容。2．人员安全情况：（1）负责员工入职、离职、停职等管理的责任部门（岗位）。（2）配合海关认证人员了解其岗位职责及日常工作情况。二、实行员工档案管理，具有动态的员工清单。员工档案管理制度的书面文件，明确员工档案管理责任部门（岗位）、工作职责、管理要求、档案资料保管和更新等内容。（1）负责员工档案管理的责任部门（岗位）。（2）员工清单包含的内容及动态维护情况。3．按照海关认证人员要求提供抽查记录：员工清单。员工清单应包含员工姓名、部门、职务（岗位）、入职时间、离职时间等内容。记录可以为纸本文档、电子文档、系统记录等。新申请认证企业，查阅最新的员工清单。重新认证企业，查阅自成为认证企业或者最近一次重新认证后每一年年末的员工清单。三、聘用员工前，核实应聘人员的身份、就业经历等信息，对拟聘用人员进行违法记录调查。聘用员工的书面文件，明确员工聘用管理责任部门（岗位）、工作职责、管理要求、档案资料保管等内容。（1）在聘用员工前，核实应聘人员的身份、就业经历等信息的具体方式及核实结果。（2）对拟聘用人员进行违法记录调查相关情况，是否调查、调查方式及调查结果等。（3）过往核实、调查后未聘用的情况。（4）员工在职期间的违法情况，以及对出现违法情况员工的处理方式。企业员工入职档案。重新认证企业，抽查自成为认证企业或者最近一次重新认证后每一年的档案。企业对新入职员工实施聘用前核实、调查工作应与企业制度规定相符，并符合本项标准要求。四、对离职停职员工及时收回工作证件、设备，并禁止其进入企业经营场所及使用企业信息系统。员工离职、停职的书面文件，明确员工离职、停职管理责任部门（岗位）、工作职责、管理要求、档案资料保管等内容。（1）办理离职、停职的具体手续。（2）对离职、停职员工的身份标识、工作证件的处置措施。（3）员工离职、停职后出入管理的具体要求。（1）企业员工离职的档案材料。重新认证企业，抽查自成为认证企业或者最近一次重新认证后每一年的档案材料。企业对离职员工手续应与企业制度规定相符，并符合本项标准要求。（2）企业离职停职员工的信息系统注销权限的记录。重新认证企业，抽查自成为认证企业或者最近一次重新认证后每一年的记录。企业对离职员工信息系统注销权限管理应与企业制度规定相符，并符合本项标准要求。4．配合海关认证人员实地查看：离职、停职员工的出入管理情况。"},
  20: {n:"商业伙伴安全",c:"贸易安全",s:["SE-10","SE-11","SE-12"],z:[{n:"安全生产契约书（新供应商）.pdf",t:"PDF"},{n:"供应商管理细则.pdf",t:"PDF"},{n:"供应商自我评价表.pdf",t:"PDF"},{n:"基本交易合同（新供应商）.pdf",t:"PDF"},{n:"守法合规与贸易安全检查清单.pdf",t:"PDF"},{n:"新供应商评价表.pdf",t:"PDF"},{n:"已有供应商QCDS评价.pdf",t:"PDF"},{n:"已有供应商契约书及审查.pdf",t:"PDF"}],l:[{n:"安全生产契约书（新供应商）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214849/2020081717432171215.pdf"},{n:"供应商管理细则20190604新",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214845/2020081808311023814.pdf"},{n:"供应商自我评价表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214842/2020081808312672196.pdf"},{n:"基本交易合同（新供应商）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214839/2020081808314861018.pdf"},{n:"守法合规与贸易安全检查清单",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214836/2020081808320323423.pdf"},{n:"新供应商评价表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214832/2020081808321647927.pdf"},{n:"已有供应--xxxx科技有限公司 QCDS评价",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214829/2020083123101811607.pdf"},{n:"已有供应--xxxx有限公司契约书及审查-",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211468/3214824/2020083123105512414.pdf"},{n:"样本5 企业内部培训照片",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211363/3430934/2020120410315015994.JPG"}],t:"建立并执行评估、检查商业伙伴供应链安全的管理制度。1．建立以下书面文件并有效落实：商业伙伴供应链安全的管理制度的书面文件，明确商业伙伴安全管理责任部门（岗位）、工作职责、管理要求、档案资料保管等内容。2．商业伙伴安全情况：（1）负责评估、检查商业伙伴供应链安全的责任部门（岗位）、人员、人数以及职责分工等。（2）企业对商业伙伴供应链安全的评估、检查的实施情况，包括评估、检查项目，具体实施流程，以及作出评估、检查结论等。3．按照海关认证人员要求提供抽查记录：企业商业伙伴供应链安全评估、检查的记录（包括评估、检查项目，评估、检查过程，评估、检查结论）。重新认证企业，抽查自成为认证企业或者最近一次重新认证后每一年的记录。企业对商业伙伴供应链安全管理情况应与企业制度规定相符，并符合本项标准要求。"},
  21: {n:"货物、物品安全",c:"贸易安全",s:["SE-13","SE-14","SE-15"],z:[{n:"部品进场检查管理程序.rar",t:"RAR"},{n:"成品仓库出货管理.rar",t:"RAR"},{n:"成品仓库作业制度.rar",t:"RAR"},{n:"成品出口系统截图.jpg",t:"JPG"},{n:"货物安全记录.pdf",t:"PDF"},{n:"原材料进口入库信息.JPG",t:"JPG"},{n:"原料及包装材料收货储存和发放程序.pdf",t:"PDF"},{n:"运输装卸存储制度.rar",t:"RAR"},{n:"资材仓库管理程序.rar",t:"RAR"},{n:"资材仓库入库管理现场展板1.jpg",t:"JPG"},{n:"资材仓库入库管理现场展板2.jpg",t:"JPG"},{n:"资材仓库入库管理现场展板3.jpg",t:"JPG"},{n:"资材管理制度.rar",t:"RAR"}],l:[{n:"资材仓库管理程序",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214883/2020083123344337221.rar"},{n:"资材管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214880/2020073117345114176.rar"},{n:"部品进场检查管理程序",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214874/2020083123351196417.rar"},{n:"成品仓库作业制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214871/2020073117335741650.rar"},{n:"成品仓库出货管理",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214868/2020083123354126868.rar"},{n:"货物安全记录",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214863/2020081808333616344.pdf"},{n:"运输装卸存储制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214859/2020073117324832341.rar"},{n:"原料及包装材料收货储存和发放程序",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211477/3214852/2020083123362310395.pdf"},{n:"原材料进口入库信息",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211480/3214903/2020073117385519606.JPG"},{n:"成品出口系统截图.",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211480/3214896/2020073117383765312.jpg"},{n:"资材仓库入库管理现场展板1",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/hwwpaq30/zpyb25/3214893/index.html"},{n:"资材仓库入库管理现场展板2",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/hwwpaq30/zpyb25/3214889/index.html"},{n:"资材仓库入库管理现场展板3",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/hwwpaq30/zpyb25/3214886/index.html"}],t:"建立并执行保证进出口货物、进出境物品在运输、装卸和存储过程中的完整性、安全性的管理制度。1．建立以下书面文件并有效落实：进出口货物、进出境物品的运输、装卸和存储等环节管理制度的书面文件，明确货物物品安全管理责任部门（岗位）、工作职责、管理要求、档案资料保管等内容。2．货物、物品安全情况：（1）负责货物、物品运输、装卸和存储等环节的责任部门（岗位）。（2）配合海关认证人员了解其岗位职责及日常工作情况。（3）企业货物、物品的进、出全流程。（4）货物、物品的运输、装卸、存储等环节的要求。3．配合海关认证人员实地查看：企业货物、物品的运输、装卸和存储等环节由商业伙伴完成的，企业应配合海关认证人员对其商业伙伴进行延伸认证。"},
  22: {n:"集装箱安全",c:"贸易安全",s:["SE-16","SE-17","SE-18"],z:[{n:"集装箱内部检查.avi",t:"AVI"},{n:"集装箱内部检查.mp4",t:"MP4"},{n:"集装箱安全管理.rar",t:"RAR"},{n:"集装箱安全记录.rar",t:"RAR"},{n:"保安核对货物信息.html",t:"HTML"},{n:"保安监装.html",t:"HTML"},{n:"仓库工作人员装货.html",t:"HTML"},{n:"装箱完毕后数量检查.html",t:"HTML"},{n:"集装箱上铅封.html",t:"HTML"},{n:"外部安全检查.html",t:"HTML"},{n:"内部安全检查.html",t:"HTML"},{n:"安全检查记录填写.html",t:"HTML"},{n:"装货区展板.html",t:"HTML"},{n:"车辆检查登记表.pdf",t:"PDF"},{n:"封条管理制度.pdf",t:"PDF"},{n:"集装箱封条检查表.docx",t:"DOCX"},{n:"集装箱管理制度.pdf",t:"PDF"},{n:"集装箱检查现场展板1.html",t:"HTML"},{n:"集装箱检查现场展板2.html",t:"HTML"}],l:[{n:"1集装箱安全管理",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211486/3215619/2020080223595291116.rar"},{n:"2集装箱安全记录",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211486/3215616/2020080223592029805.rar"},{n:"车辆检查登记表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211486/3214920/2020073117402199850.pdf"},{n:"封条管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211486/3214917/2020081808341841947.pdf"},{n:"集装箱封条检查表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211486/3214914/2020073117395316708.docx"},{n:"集装箱管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211486/3214908/2020083123373624772.pdf"},{n:"9-装货区展板",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/zpyb4047/3215612/index.html"},{n:"集装箱检查现场展板1",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/zpyb4047/3215609/index.html"},{n:"集装箱检查现场展板2",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/zpyb4047/3215606/index.html"},{n:"1-集装箱内部检查",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3215640/index.html"},{n:"4-保安核对货物信息",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3215637/index.html"},{n:"5-保安监装",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3215634/index.html"},{n:"6-仓库工作人员装货",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3215631/index.html"},{n:"7-装箱完毕后数量检查",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3215628/index.html"},{n:"8-集装箱上铅封",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3215625/index.html"},{n:"9-外部安全检查",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3232487/index.html"},{n:"10-内部安全检查",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3232508/index.html"},{n:"11-安全检查记录填写",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/jzxaq3/3215622/3232514/index.html"}],t:"建立并执行保证集装箱完整性、安全性的管理制度。涉及集装箱或者箱式货车运输的企业，认证以下内容，否则不适用本项标准。1．建立以下书面文件并有效落实：集装箱管理的书面文件，明确包含集装箱安全责任部门（岗位）、工作职责、管理要求、档案资料保管等内容。2．集装箱安全情况：（1）企业所在的国际贸易供应链环节涉及进出口货物、进出境物品运输的情况及运输方式。（2）负责集装箱安全管理的责任部门（岗位）。（3）配合海关认证人员了解其岗位职责及日常工作情况。（4）集装箱作业流程介绍。3．按照海关认证人员要求提供抽查记录：不涉及集装箱运输的，企业提供相关情况说明的书面材料。"},
  23: {n:"运输工具安全",c:"贸易安全",s:["SE-19","SE-20","SE-21"],z:[{n:"司机提货登记及身份核实.html",t:"HTML"},{n:"车底检查.html",t:"HTML"},{n:"安保管理以及安保应急处理程序.pdf",t:"PDF"},{n:"车辆安全检查管理制度.rar",t:"RAR"},{n:"车辆出入登记表.jpg",t:"JPG"},{n:"车辆检查记录.rar",t:"RAR"},{n:"车辆进出管理规定.pdf",t:"PDF"},{n:"车辆状况检查表样本.docx",t:"DOCX"},{n:"货车十点检查表.jpg",t:"JPG"},{n:"警卫管理.pdf",t:"PDF"},{n:"送货司机信息.xlsx",t:"XLSX"},{n:"提货司机信息登记表.xlsx",t:"XLSX"},{n:"物流运输标准.doc",t:"DOC"},{n:"原料及包装材料收货储存和发放程序.pdf",t:"PDF"},{n:"装卸登记表.pdf",t:"PDF"}],l:[{n:"安保管理以及安保应急处理程序",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215587/2020081808351683197.pdf"},{n:"车辆安全检查管理制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215584/2020080223480056626.rar"},{n:"车辆检查记录",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215581/2020080223472110823.rar"},{n:"车辆进出管理规定",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215578/2020081808352944712.pdf"},{n:"车辆状况检查表样本2019",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215575/2020080223463261661.docx"},{n:"警卫管理",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215572/2020081808354134709.pdf"},{n:"送货司机信息",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215569/2020081811371539694.xlsx"},{n:"提货司机信息登记表（提前）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215566/2020081811380119934.xlsx"},{n:"物流运输标准",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215563/2020080223445742569.doc"},{n:"原料及包装材料收货储存和发放程序",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215560/2020081808360120498.pdf"},{n:"装卸登记表 （2019年06-09月样本）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211495/3215557/2020081808361784058.pdf"},{n:"车辆出入登记表20190308-2",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211498/3215593/2020081811394255401.jpg"},{n:"货车十点检查表",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211498/3215590/2020081811405053232.jpg"},{n:"1-司机提货登记及身份核实",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/ysgjaq17/3215596/3215602/index.html"},{n:"2-车底检查",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/ysgjaq17/3215596/3215599/index.html"}],t:"建立并执行保证运输工具的完整性、安全性的管理制度。涉及进出口货物、进出境物品运输的企业，认证以下内容，否则不适用本项标准。1．建立以下书面文件并有效落实：运输工具安全管理制度的书面文件，明确运输工具安全管理责任部门（岗位）、工作职责、管理要求、档案资料保管等内容。2．运输工具安全情况：（1）企业所在的国际贸易供应链环节涉及进出口货物、进出境物品运输的情况及运输方式。（2）负责运输工具安全管理的责任部门（岗位）。（3）配合海关认证人员了解其岗位职责及日常工作情况。3．按照海关认证人员要求提供抽查记录：对不涉及进出口货物、进出境物品运输的，企业提供相关情况说明的书面材料。"},
  24: {n:"危机管理",c:"贸易安全",s:["SE-22"],z:[{n:"消防演习记录.pdf",t:"PDF"},{n:"企业应急演练（灭火）.html",t:"HTML"},{n:"企业应急演练图片（逃生）.html",t:"HTML"},{n:"应急预案（不明身份人员强行进厂）.html",t:"HTML"},{n:"危机管理制度（厂区巡检）.html",t:"HTML"},{n:"危机管理制度（紧急应变办法）.html",t:"HTML"},{n:"危机管理制度（危险物管理办法）.html",t:"HTML"},{n:"危机管理制度（应急准备和响应程序）.pdf",t:"PDF"},{n:"消防演习.pdf",t:"PDF"},{n:"应急准备和响应控制程序.pdf",t:"PDF"}],l:[{n:"企业应急演练记录（消防演习）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211504/3215535/2020080223383582160.pdf"},{n:"危机管理制度（应急准备和响应控制程序）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211504/3215532/2020080223380644525.pdf"},{n:"消防演习",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211504/3215529/2020080223370622085.pdf"},{n:"应急准备和响应控制程序",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211504/3215526/2020080223364217498.pdf"},{n:"企业应急演练（灭火）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/wjgl95/zpyb21/3215553/index.html"},{n:"企业应急演练图片（逃生）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/wjgl95/zpyb21/3215550/index.html"},{n:"企业应急预案（不明身份人员强行进厂应急演习计划）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/wjgl95/zpyb21/3215547/index.html"},{n:"危机管理制度（《厂区巡检管理办法》3.5 ，3.6， 3.7，3.8）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/wjgl95/zpyb21/3215544/index.html"},{n:"危机管理制度（紧急应变处理办法）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/wjgl95/zpyb21/3215541/index.html"},{n:"危机管理制度（危险物管理办法）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/wjgl95/zpyb21/3215538/index.html"}],t:"发生的灾害或者紧急情况涉及海关业务的，应当及时向海关报告。"},
  25: {n:"安全培训",c:"贸易安全",s:["SE-23","SE-24","SE-25"],z:[{n:"安全培训.pdf",t:"PDF"},{n:"安全培训制度（教育训练程序）.pdf",t:"PDF"},{n:"安全培训制度（员工教育训练办法）.html",t:"HTML"},{n:"防恐安全培训.pdf",t:"PDF"},{n:"供应链安全培训记录.pdf",t:"PDF"},{n:"供应链安全培训记录（国际贸易风险控制）.html",t:"HTML"},{n:"供应链安全培训教材-2019年度.pdf",t:"PDF"},{n:"贸易安全培训记录（教育训练表单）.html",t:"HTML"},{n:"贸易安全培训考题.html",t:"HTML"},{n:"培训制度.pdf",t:"PDF"},{n:"消防安全培训记录.html",t:"HTML"},{n:"消防安全培训签到记录.html",t:"HTML"},{n:"企业安全培训资料.pdf",t:"PDF"},{n:"化学品泄漏演习总结.html",t:"HTML"},{n:"消防演习总结.html",t:"HTML"},{n:"消防演习照片.html",t:"HTML"}],l:[{n:"安全培训",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211513/3215496/2020080223312092384.pdf"},{n:"（供应链安全培训教材-2019年度）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211513/3215493/2020080223305625088.pdf"},{n:"安全培训制度（QP-GE-001 教育训练管理程序 4版）",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211513/3215490/2020080223303311427.pdf"},{n:"防恐安全培训",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211513/3215487/2020080223301542472.pdf"},{n:"供应链安全培训记录",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211513/3215484/2020083123390463999.pdf"},{n:"培训制度",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211513/3215481/2020080223293551326.pdf"},{n:"企业安全培训资料",u:"http://nanjing.customs.gov.cn/nanjing_customs/resource/cms/article/3211513/3215475/2020083123444451421.pdf"},{n:"安全培训制度（员工教育训练办法及实施计划 （B070201）之4.7.2.7 D）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3215523/index.html"},{n:"供应链安全培训记录（国际贸易中的风险控制与防范培训）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3423251/index.html"},{n:"贸易安全、危机管理培训记录（教育训练记录表单）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3423358/index.html"},{n:"贸易安全、危机管理培训考题",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3423392/index.html"},{n:"企业安全培训记录（消防安全培训）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3215511/index.html"},{n:"企业安全培训记录（消防安全培训签到记录）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3215508/index.html"},{n:"危机处理模拟演练记录（化学品泄漏演习总结）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3215505/index.html"},{n:"危机处理模拟演练记录（消防演习总结）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3423441/index.html"},{n:"危机处理模拟演练照片（消防演习）",u:"http://nanjing.customs.gov.cn/nanjing_customs/aeoqyrzscjsfw/cjsdh96/jcksfhr/gjrz19/aqpx62/zpyb13/3215499/index.html"}],t:"一、建立并执行贸易安全的内部培训机制。1．建立以下书面文件并有效落实：企业内部涉及贸易安全培训的书面文件，明确负责贸易安全培训的责任部门（岗位）、工作职责、管理要求、档案资料保管等内容。2．安全培训情况：（1）负责贸易安全内部培训的责任部门（岗位）。（2）贸易安全内部培训计划、培训方式、具体开展情况等。3．按照海关认证人员要求提供抽查记录：企业贸易安全内部培训记录。重新认证企业，抽查自成为认证企业或者最近一次重新认证后每一年的记录。企业贸易安全培训情况应与企业制度规定相符，并符合本项标准要求。二、定期对员工进行与国际贸易供应链中货物流动相关风险的教育和培训，让员工了解、掌握海关认证企业在保证货物安全过程中应做的工作。1．安全培训情况：（1）企业对员工进行与国际贸易供应链中货物、物品流动相关风险的教育和培训情况，培训对象、内容、方式、频次等。（2）配合海关认证人员了解其贸易安全相关岗位人员对海关认证企业在保证货物、物品安全过程中应做工作的了解、掌握情况。（3）配合海关认证人员了解其贸易安全相关岗位人员对发现可疑事件（包括可疑人员、可疑货物、异常情况和内部阴谋等）处置程序的了解、掌握情况。2．按照海关认证人员要求提供抽查记录：企业安全意识培训记录。企业安全培训情况应与企业制度规定相符，并符合本项标准要求。3．配合海关认证人员实地查看：企业贸易安全相关岗位人员的实际操作情况。三、定期对员工进行危机管理的培训和危机处理模拟演练，让员工了解、掌握在应急处置和异常报告过程中应做的工作。危机管理培训书面文件，明确危机管理责任部门（岗位）、工作职责、管理要求、危机管理培训和模拟演练、档案资料保管等内容。（1）危机管理的培训内容、培训频次等。（2）对员工进行危机处理模拟演练的具体情况。（3）配合海关认证人员了解其贸易安全相关岗位人员对应急处置和异常报告过程中应做工作的了解、掌握情况。（1）危机管理培训的历史记录。（2）企业危机处理模拟演练的照片、视频等记录。企业危机管理培训情况应与企业制度规定相符，并符合本项标准要求。4．配合海关认证人员实地查看：企业危机管理培训的实际执行情况和培训效果。"}
};
