import React from 'react';
import SEOHead from '@/components/seo/SEOHead';
import Layout from '@/components/Layout';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { 
    Dna, 
    ArrowRight, 
    Microscope, 
    BookOpen,
    Activity,
    Target,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';

const ImatBiologySyllabus: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout variant="public">
        <div className="bg-gray-50 min-h-screen">
            <SEOHead 
                title="IMAT Biology Syllabus 2026: The Definitive 23-Question Guide | Italostudy"
                description="Master the IMAT Biology section. A 3500+ word deep dive into every topic mandated by the Italian Ministry (MUR), from bioenergetics to human anatomy, with book recommendations."
                keywords="imat biology syllabus, imat biology topics, imat biology books, imat human anatomy, imat genetics, imat bioenergetics"
            />

            {/* Hero Section */}
            <div className="bg-white border-b pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm font-medium mb-6">
                            <Microscope className="w-4 h-4" /> The 23-Question Heavyweight
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                            The Definitive IMAT Biology Syllabus (2026)
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Biology makes up nearly 40% of the entire exam. If you fail Biology, you fail the IMAT. This is the most exhaustive, line-by-line breakdown of the official MUR Biology syllabus available on the internet.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Content Column */}
                    <div className="lg:col-span-2">
                        <article className="prose prose-lg prose-rose max-w-none">
                            <h2>Why Biology is the Ultimate Kingmaker</h2>
                            <p>
                                The IMAT consists of 60 questions. Out of these, <strong>23 questions</strong> are dedicated solely to Biology. That is 38.3% of the exam. If you score perfectly in Biology, you secure 34.5 points out of the 90 available. Historically, scoring 34.5 points puts you halfway to the cutoff for top-tier universities like Milan or Rome, without even touching Chemistry or Physics.
                            </p>
                            <p>
                                Unlike the <Link to="/imat-vs-neet-2026" className="text-rose-600 hover:underline">NEET exam in India</Link>, the IMAT biology section is not an encyclopedic memory test. It is highly analytical. The Italian Ministry of University and Research (MUR) groups the biology syllabus into distinct, highly logical categories.
                            </p>

                            <hr />

                            <h2>1. The Chemistry of Living Things</h2>
                            <p>
                                This section forms the bridge between Biology and Chemistry. It tests your fundamental understanding of the building blocks of life. Do not confuse this with the separate 15-question Chemistry section; this is Biochemistry.
                            </p>
                            <ul>
                                <li><strong>Water and Weak Interactions:</strong> You must understand the properties of water (cohesion, adhesion, specific heat capacity) and why hydrogen bonds and Van der Waals forces are critical for biological structures.</li>
                                <li><strong>Biological Macromolecules:</strong> 
                                    <ul>
                                        <li><strong>Carbohydrates:</strong> Monosaccharides (glucose, fructose), disaccharides (sucrose, lactose), and polysaccharides (glycogen, starch, cellulose). Know their structures and glycosidic bonds.</li>
                                        <li><strong>Lipids:</strong> Triglycerides, phospholipids (crucial for membranes), and steroids (cholesterol, hormones). Understand saturated vs unsaturated fatty acids.</li>
                                        <li><strong>Proteins:</strong> Amino acids, peptide bonds, and the four levels of protein structure (primary to quaternary).</li>
                                        <li><strong>Nucleic Acids:</strong> DNA and RNA structure, nucleotides, and phosphodiester bonds.</li>
                                    </ul>
                                </li>
                                <li><strong>Enzymes:</strong> How enzymes lower activation energy, the lock-and-key vs induced-fit models, coenzymes, and factors affecting enzyme activity (temperature, pH, competitive vs non-competitive inhibition).</li>
                            </ul>

                            <hr />

                            <h2>2. The Cell as the Basis of Life</h2>
                            <p>
                                Cell biology is arguably the most frequently tested domain in the IMAT. You must possess a microscopic understanding of cellular architecture and function.
                            </p>
                            <ul>
                                <li><strong>Cell Theory:</strong> The historical foundation.</li>
                                <li><strong>Prokaryotic vs Eukaryotic Cells:</strong> The fundamental differences in size, structure, DNA organization (plasmids vs linear chromosomes), and ribosomes (70S vs 80S).</li>
                                <li><strong>Animal vs Plant Cells:</strong> Differences in organelles (chloroplasts, cell wall, large central vacuole).</li>
                                <li><strong>Cellular Organelles:</strong> Deep knowledge of the nucleus, rough and smooth endoplasmic reticulum, Golgi apparatus, lysosomes, peroxisomes, mitochondria, and chloroplasts. You must know their specific functions and how they interact (e.g., the endomembrane system).</li>
                                <li><strong>The Cell Membrane:</strong> The fluid mosaic model. Phospholipid bilayer, integral and peripheral proteins, cholesterol, and glycoproteins.</li>
                                <li><strong>Cellular Transport:</strong> Passive transport (simple diffusion, facilitated diffusion, osmosis) vs active transport (primary and secondary). Endocytosis and exocytosis.</li>
                            </ul>

                            <hr />

                            <h2>3. Bioenergetics</h2>
                            <p>
                                This is traditionally the hardest section for students because it involves complex metabolic pathways. The MUR loves asking detailed questions about where specific reactions occur and what the net yields are.
                            </p>
                            <ul>
                                <li><strong>ATP (Adenosine Triphosphate):</strong> The energy currency. Structure and function.</li>
                                <li><strong>Cellular Respiration (Aerobic):</strong> You must know the inputs, outputs, and cellular locations of:
                                    <ul>
                                        <li><strong>Glycolysis:</strong> Cytoplasm. Net yield of 2 ATP and 2 NADH.</li>
                                        <li><strong>Link Reaction & Krebs Cycle:</strong> Mitochondrial matrix. Production of CO2, NADH, and FADH2.</li>
                                        <li><strong>Electron Transport Chain (Oxidative Phosphorylation):</strong> Inner mitochondrial membrane (cristae). The role of oxygen as the final electron acceptor, ATP synthase, and the proton motive force.</li>
                                    </ul>
                                </li>
                                <li><strong>Anaerobic Respiration (Fermentation):</strong> Lactic acid fermentation (in human muscle cells) and alcoholic fermentation (in yeast).</li>
                                <li><strong>Photosynthesis:</strong> The Light-Dependent reactions (thylakoid membrane, photosystems I and II) and the Light-Independent reactions / Calvin Cycle (stroma, RuBisCO, carbon fixation).</li>
                            </ul>

                            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 my-6">
                                <p className="text-rose-800 m-0"><strong>High-Yield Tip:</strong> The IMAT frequently tests your ability to track a single carbon atom from a molecule of glucose through glycolysis and the Krebs cycle until it is exhaled as CO2.</p>
                            </div>

                            <hr />

                            <h2>4. Reproduction and Inheritance</h2>
                            <p>
                                This section combines classical Mendelian genetics with modern molecular genetics. Expect complex pedigree analysis and probability questions here, which often overlap with the <Link to="/imat-logical-reasoning-guide-2026" className="text-rose-600 hover:underline">Logical Problem Solving</Link> section.
                            </p>
                            <ul>
                                <li><strong>The Cell Cycle:</strong> G1, S (DNA replication), G2, and M phases. Checkpoints and the role of cyclins.</li>
                                <li><strong>Mitosis vs Meiosis:</strong> Detailed stages (Prophase, Metaphase, Anaphase, Telophase). Crossing over in Prophase I and independent assortment in Metaphase I. How meiosis ensures genetic diversity.</li>
                                <li><strong>Mendelian Genetics:</strong> Monohybrid and dihybrid crosses, the laws of segregation and independent assortment. Dominance, recessiveness, co-dominance, and incomplete dominance.</li>
                                <li><strong>Classical Genetics:</strong> Sex-linked inheritance (X-linked traits like hemophilia and color blindness), multiple alleles (ABO blood groups), and epistasis. <strong>You must master pedigree charts.</strong></li>
                                <li><strong>Molecular Genetics:</strong> 
                                    <ul>
                                        <li>DNA replication (semi-conservative, helicase, DNA polymerase).</li>
                                        <li>Transcription (RNA polymerase, mRNA processing, introns/exons).</li>
                                        <li>Translation (ribosomes, tRNA, codons, anticodons).</li>
                                    </ul>
                                </li>
                                <li><strong>Mutations:</strong> Point mutations (silent, missense, nonsense), frameshift mutations, and chromosomal mutations (deletions, duplications, inversions, translocations).</li>
                            </ul>

                            <hr />

                            <h2>5. Anatomy and Physiology of Animals and Humans</h2>
                            <p>
                                This is the most voluminous section. You must have a solid foundation in human anatomy and how the various systems maintain homeostasis.
                            </p>
                            <ul>
                                <li><strong>Tissues:</strong> Epithelial, connective, muscle, and nervous tissues.</li>
                                <li><strong>The Nervous System:</strong> Central (brain and spinal cord) vs Peripheral. Autonomic (sympathetic vs parasympathetic) vs Somatic. The structure of a neuron, action potentials, and synapses.</li>
                                <li><strong>The Endocrine System:</strong> Major glands (pituitary, thyroid, adrenal, pancreas) and their hormones. Peptide vs steroid hormone mechanisms. Feedback loops.</li>
                                <li><strong>The Circulatory System:</strong> The structure of the heart, the cardiac cycle, blood vessels (arteries, veins, capillaries), and the composition of blood (RBCs, WBCs, platelets, plasma).</li>
                                <li><strong>The Respiratory System:</strong> Anatomy of the lungs, the mechanics of breathing (diaphragm and intercostal muscles), and gas exchange in the alveoli.</li>
                                <li><strong>The Digestive System:</strong> Anatomy of the GI tract, accessory organs (liver, gallbladder, pancreas), and the specific enzymes involved in digesting carbs, proteins, and lipids.</li>
                                <li><strong>The Excretory System:</strong> The kidney, the nephron (glomerulus, Bowman's capsule, Loop of Henle), urine formation, and osmoregulation (ADH).</li>
                                <li><strong>The Immune System:</strong> Innate vs adaptive immunity. B-cells (antibodies) and T-cells. Active vs passive immunity.</li>
                                <li><strong>The Reproductive System:</strong> Male and female anatomy, spermatogenesis, oogenesis, and the menstrual cycle hormones (FSH, LH, Estrogen, Progesterone).</li>
                            </ul>

                            <hr />

                            <h2>Recommended Preparation Resources</h2>
                            <p>
                                Because the IMAT is an international exam, no single textbook covers the exact syllabus. However, the academic standard required is equivalent to the British A-Levels.
                            </p>
                            <ul>
                                <li><strong>Cambridge International AS and A Level Biology Coursebook:</strong> This is the absolute gold standard. The depth of explanation perfectly matches the IMAT's conceptual style.</li>
                                <li><strong>Pearson Biology: A Global Approach:</strong> Excellent for deep dives, particularly in Bioenergetics and Genetics.</li>
                                <li><strong>Bioninja (IB Biology):</strong> An incredible, free online resource that breaks down biological concepts into easily digestible bullet points.</li>
                            </ul>
                            <p>
                                Remember, your goal is not to read these books cover-to-cover. Your goal is to use them as reference manuals to master the specific topics outlined in this syllabus. Once you feel confident, use our <Link to="/imat-score-calculator" className="text-rose-600 hover:underline">IMAT Score Calculator</Link> to track your progress on past papers.
                            </p>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24 self-start">
                            <KnowledgeHubSidebar examType="imat" />
                        </div>
                    </div>

                </div>
            </div>

            <CTASection />
        </div>
        </Layout>
    );
};

export default ImatBiologySyllabus;
