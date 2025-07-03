(()=>{var e={};e.id=322,e.ids=[322],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},46113:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>P,routeModule:()=>R,serverHooks:()=>O,workAsyncStorage:()=>f,workUnitAsyncStorage:()=>h});var s={};r.r(s),r.d(s,{GET:()=>E});var o=r(96559),i=r(48088),l=r(37719),n=r(87550),p=r.n(n),a=r(32190),u=r(33873),d=r.n(u),c=r(29021),m=r.n(c);let b=d().join(process.cwd(),"db","leetcode_problems.db");class g{constructor(){this.db=null}connect(){if(!this.db){if(!m().existsSync(b))throw Error("Database not found. Please initialize the database first.");this.db=new(p())(b)}return this.db}getProblemBySlug(e){let t=this.connect(),r=`
            SELECT 
                p.*,
                GROUP_CONCAT(DISTINCT e.example_text ORDER BY e.example_order) as examples,
                GROUP_CONCAT(DISTINCT c.constraint_text ORDER BY c.constraint_order) as constraints
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            WHERE p.slug = ?
            GROUP BY p.problem_id
        `,s=t.prepare(r).get(e);return s&&(s.examples=s.examples?s.examples.split(","):[],s.constraints=s.constraints?s.constraints.split(","):[]),s}getNextProblem(e){let t=this.connect(),r=`
            SELECT slug, title
            FROM problems 
            WHERE problem_id > (
                SELECT problem_id FROM problems WHERE slug = ?
            )
            ORDER BY problem_id ASC
            LIMIT 1
        `;return t.prepare(r).get(e)}getPreviousProblem(e){let t=this.connect(),r=`
            SELECT slug, title
            FROM problems 
            WHERE problem_id < (
                SELECT problem_id FROM problems WHERE slug = ?
            )
            ORDER BY problem_id DESC
            LIMIT 1
        `;return t.prepare(r).get(e)}getRelatedProblems(e,t){let r=this.connect(),s=`
            SELECT slug, title, difficulty
            FROM problems 
            WHERE slug != ? AND difficulty = ?
            ORDER BY RANDOM()
            LIMIT 3
        `;return r.prepare(s).all(e,t)}close(){this.db&&(this.db.close(),this.db=null)}}let x=new g;async function E(e,{params:t}){try{let{slug:e}=t;if(!e)return a.NextResponse.json({error:"Problem slug is required"},{status:400});let r=x.getProblemBySlug(e);if(!r)return a.NextResponse.json({error:"Problem not found"},{status:404});let s=x.getNextProblem(e),o=x.getPreviousProblem(e),i=x.getRelatedProblems(e,r.difficulty),l={id:r.problem_id,title:r.title,slug:r.slug,difficulty:r.difficulty,description:r.description,examples:r.examples,constraints:r.constraints,url:r.url,navigation:{next:s,previous:o,related:i}};return a.NextResponse.json({success:!0,data:l})}catch(e){return console.error("Error fetching problem details:",e),a.NextResponse.json({error:"Failed to fetch problem details",details:e.message},{status:500})}}let R=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/leetcode/problems/[slug]/route",pathname:"/api/leetcode/problems/[slug]",filename:"route",bundlePath:"app/api/leetcode/problems/[slug]/route"},resolvedPagePath:"/Users/Apple/Downloads/Learning/src/app/api/leetcode/problems/[slug]/route.js",nextConfigOutput:"",userland:s}),{workAsyncStorage:f,workUnitAsyncStorage:h,serverHooks:O}=R;function P(){return(0,l.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:h})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},87550:e=>{"use strict";e.exports=require("better-sqlite3")},96487:()=>{}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580],()=>r(46113));module.exports=s})();