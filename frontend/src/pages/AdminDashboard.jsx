export default function AdminDashboard(){

return(

<div
style={{
padding:"30px"
}}
>

<h1>
📈 Analytics Center
</h1>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px"
}}
>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
Disease Trends
</div>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
Risk Forecast
</div>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
AI Analytics
</div>

</div>

</div>

);

}