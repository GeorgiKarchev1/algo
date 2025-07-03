(()=>{var e={};e.id=522,e.ids=[522],e.modules={2476:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>g,serverHooks:()=>_,workAsyncStorage:()=>R,workUnitAsyncStorage:()=>E});var s={};r.r(s),r.d(s,{GET:()=>O});var i=r(96559),l=r(48088),o=r(37719),p=r(87550),n=r.n(p),a=r(32190),c=r(33873),d=r.n(c),u=r(29021),m=r.n(u);let b=d().join(process.cwd(),"db","leetcode_problems.db");class x{constructor(){this.db=null}connect(){if(!this.db){if(!m().existsSync(b))throw Error("Database not found. Please initialize the database first.");this.db=new(n())(b)}return this.db}getAllProblems(e={}){let t=this.connect(),{page:r=1,limit:s=12,search:i="",difficulty:l="all",sortBy:o="title",sortOrder:p="ASC"}=e,n="",a=[];i&&(n+=" WHERE (p.title LIKE ? OR p.description LIKE ?)",a.push(`%${i}%`,`%${i}%`)),"all"!==l&&(n+=i?" AND":" WHERE","medium-hard"===l?(n+=" p.difficulty IN (?, ?)",a.push("Medium","Hard")):(n+=" p.difficulty = ?",a.push(l)));let c=["title","difficulty","problem_id"].includes(o)?o:"title",d=["ASC","DESC"].includes(p)?p:"ASC",u=`
            SELECT 
                p.problem_id,
                p.title,
                p.slug,
                p.difficulty,
                p.description,
                p.url,
                COUNT(e.id) as example_count,
                COUNT(c.id) as constraint_count
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            ${n}
            GROUP BY p.problem_id
            ORDER BY p.${c} ${d}
            LIMIT ? OFFSET ?
        `,m=`
            SELECT COUNT(DISTINCT p.problem_id) as total
            FROM problems p
            ${n}
        `,b=t.prepare(u),x=t.prepare(m),f=b.all(...a,s,(r-1)*s),O=x.get(...a).total;return{problems:f,pagination:{page:r,limit:s,total:O,totalPages:Math.ceil(O/s),hasNext:r<Math.ceil(O/s),hasPrev:r>1},filters:{search:i,difficulty:l,sortBy:o,sortOrder:p}}}getProblemBySlug(e){let t=this.connect(),r=`
            SELECT 
                p.*,
                GROUP_CONCAT(DISTINCT e.example_text ORDER BY e.example_order) as examples,
                GROUP_CONCAT(DISTINCT c.constraint_text ORDER BY c.constraint_order) as constraints
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            WHERE p.slug = ?
            GROUP BY p.problem_id
        `,s=t.prepare(r).get(e);return s&&(s.examples=s.examples?s.examples.split(","):[],s.constraints=s.constraints?s.constraints.split(","):[]),s}getRandomProblem(e="all"){let t=this.connect(),r="",s=[];"all"!==e&&("medium-hard"===e?(r=" WHERE p.difficulty IN (?, ?)",s.push("Medium","Hard")):(r=" WHERE p.difficulty = ?",s.push(e)));let i=`
            SELECT 
                p.*,
                GROUP_CONCAT(DISTINCT e.example_text ORDER BY e.example_order) as examples,
                GROUP_CONCAT(DISTINCT c.constraint_text ORDER BY c.constraint_order) as constraints
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            ${r}
            GROUP BY p.problem_id
            ORDER BY RANDOM()
            LIMIT 1
        `,l=t.prepare(i).get(...s);return l&&(l.examples=l.examples?l.examples.split(","):[],l.constraints=l.constraints?l.constraints.split(","):[]),l}close(){this.db&&(this.db.close(),this.db=null)}}let f=new x;async function O(e){try{let{searchParams:t}=new URL(e.url);if("true"===t.get("random")){let e=t.get("difficulty")||"all",r=f.getRandomProblem(e);if(!r)return a.NextResponse.json({error:"No problems found"},{status:404});return a.NextResponse.json({success:!0,data:{id:r.problem_id,title:r.title,slug:r.slug,difficulty:r.difficulty,description:r.description,examples:r.examples,constraints:r.constraints,url:r.url}})}let r=parseInt(t.get("page")||"1"),s=parseInt(t.get("limit")||"12"),i=t.get("search")||"",l=t.get("difficulty")||"all",o=t.get("sortBy")||"title",p=t.get("sortOrder")||"ASC",n=f.getAllProblems({page:r,limit:s,search:i,difficulty:l,sortBy:o,sortOrder:p}),c=n.problems.map(e=>({id:e.problem_id,title:e.title,slug:e.slug,difficulty:e.difficulty,description:e.description.substring(0,200)+"...",url:e.url,exampleCount:e.example_count,constraintCount:e.constraint_count}));return a.NextResponse.json({success:!0,data:{problems:c,pagination:n.pagination,filters:n.filters}})}catch(e){return console.error("Error fetching problems:",e),a.NextResponse.json({error:"Failed to fetch problems",details:e.message},{status:500})}}let g=new i.AppRouteRouteModule({definition:{kind:l.RouteKind.APP_ROUTE,page:"/api/leetcode/problems/route",pathname:"/api/leetcode/problems",filename:"route",bundlePath:"app/api/leetcode/problems/route"},resolvedPagePath:"/Users/Apple/Downloads/Learning/src/app/api/leetcode/problems/route.js",nextConfigOutput:"",userland:s}),{workAsyncStorage:R,workUnitAsyncStorage:E,serverHooks:_}=g;function h(){return(0,o.patchFetch)({workAsyncStorage:R,workUnitAsyncStorage:E})}},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},87550:e=>{"use strict";e.exports=require("better-sqlite3")},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580],()=>r(2476));module.exports=s})();