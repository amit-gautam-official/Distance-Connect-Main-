import {
    PromptTemplate,
    PipelinePromptTemplate,
  } from "@langchain/core/prompts";


  
  
  const fullPrompt = PromptTemplate.fromTemplate(`{introduction}
  
  {example}
  
  {start}`
);
  
  const introductionPrompt = PromptTemplate.fromTemplate(
    `You are an expert mentor classifier for a mentorship platform. Based on a mentor's experience, companies, and roles, classify them into one of the following tiers:
  

    There are 6 tiers:

    1. Junior — 0-2 years experience. Often students, interns, or early-stage professionals. Price: ₹200-₹500/session.
    2. Mid-Level A — 2-5 years in service-based companies or early-stage startups. Price: ₹500–₹800/session.
    3. Mid-Level B — 2-5 years in top product companies (e.g., FAANG, Flipkart, Razorpay) or with high-impact technical roles. Price: ₹800–₹1,100/session.
    4. Senior A — 5-10 years in non-FAANG companies. Team leads, senior engineers, architects. Price: ₹1,100–₹1,300/session.
    5. Senior B — 5-10 years in FAANG/product companies. Staff engineers, principal engineers, or experienced hiring managers. Price: ₹1,300–₹1,500/session.
    6. Expert — 10+ years or highly niche experts (e.g., AI PhD, ex-CTO, director-level, FAANG hiring lead). Price: ₹1,500+/session.
    
  
    Respond in **structured JSON** using this schema:

    {{
    "tier": "One of: Junior | Mid-Level A | Mid-Level B | Senior A | Senior B | Expert",
    "recommendedPriceRange": [min, max], // in ₹
    "reason": "Short justification based on experience, company type, and role"
  }}
  `
  );
  
const examplePrompt = PromptTemplate.fromTemplate(`Here are some examples:

---

Input:
Experience: 1 year  
Companies: Final-year student, internship at Infosys  
Roles: Intern at Infosys, student developer  

Output:
{{
  "tier": "Junior",
  "recommendedPriceRange": [200, 500],
  "reason": "Only 1 year of experience as a student intern, fits Junior tier"
}}

---

Input:
Experience: 4 years  
Companies: Wipro (2 years), early-stage fintech startup (2 years)  
Roles: SDE-I at Wipro, SDE-II at startup  

Output:
{{
  "tier": "Mid-Level A",
  "recommendedPriceRange": [500, 800],
  "reason": "4 years total in service-based and startup environments"
}}

---

Input:
Experience: 5 years  
Companies: Razorpay (3 years), Amazon (2 years)  
Roles: SDE-II at Razorpay, SDE-III at Amazon  

Output:
{{
  "tier": "Mid-Level B",
  "recommendedPriceRange": [800, 1100],
  "reason": "5 years in top product companies with high-impact SDE roles"
}}

---

Input:
Experience: 9 years  
Companies: Cognizant (6 years), mid-sized SaaS company (3 years)  
Roles: Senior Developer at Cognizant, Tech Lead at SaaS company  

Output:
{{
  "tier": "Senior A",
  "recommendedPriceRange": [1100, 1300],
  "reason": "9 years total in non-FAANG companies with tech lead responsibilities"
}}

---

Input:
Experience: 11 years  
Companies: Meta (6 years), Google (5 years)  
Roles: Staff Engineer, Principal Engineer  

Output:
{{
  "tier": "Senior B",
  "recommendedPriceRange": [1500 - 3000],
  "reason": "11 years in FAANG companies as Staff and Principal Engineer"
}}

---

Input:
Experience: 17 years  
Companies: Nvidia (10 years), AI research lab (7 years)  
Roles: Director of AI, PhD in machine learning  

Output:
{{
  "tier": "Expert",
  "recommendedPriceRange": [1500 - 5000],
  "reason": "17 years with niche expertise in AI and director-level leadership"
}}
`);

    
  
  const startPrompt = PromptTemplate.fromTemplate(`Now, classify this mentor:
  Input:
  {input}
  
  Output:`);
  
  const composedPrompt = new PipelinePromptTemplate({
    pipelinePrompts: [
      {
        name: "introduction",
        prompt: introductionPrompt,
      },
      {
        name: "example",
        prompt: examplePrompt,
      },
      {
        name: "start",
        prompt: startPrompt,
      },
    ],
    finalPrompt: fullPrompt,
  });

  
export { composedPrompt };  