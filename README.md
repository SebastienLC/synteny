**1. Project Name:** 
Synteny plots v1.0.0

**2. Project repository:** 
https://github.com/umms-hackathon/synteny.git

**3. Team members:**

**4. Aim:** 
Showing the location of the genes in other species.

**5. Project description:**
What you need to do is below;

5.1. Put all chromosomes for each species (human, marmoset, mouse) into a single column in the plot like in the figure. Make sure the heights of each chromosomes in the bars are correlated with the actual chromosome sizes.

5.2. Draw lines by matching the gene names in the bed files. You will calculate the relative positions using the location of the gene. You can use the center of the gene by having the average of the second and third columns in the bed file.

5.3. One gene can be in multiple locations in the other species. For those cases just put multiple lines.

* Please ignore the read counts in the plots. You only need to draw the lines to show the relative positions of the genes in different species.  
* Bed file: Given bed files hold the location of the genes in the chromosomes. (You can ignore 5 and 6 columns in the bed files)
	• chrom - name of the chromosome.
	• chromStart - Start position of the gene.
	• chromEnd - End position of the gene.
	• genename - gene name that are going to be used in the matching. 
5.4. Bed files should be uploadable to the interface.

5.5. Create the same plot with circular layout using circusJS.

**6. Supporting material and links:**

You can download the bed files and chromosome sizes that you are going to use in this challenge using the link below;

https://www.dropbox.com/s/7x9o3brc5ilm12h/files.tar.gz?dl=0

Please check some examples in the pages below that uses javascript to visualize chromosomes. You don’t have to use their libraries. These are just examples to help you.

https://eweitz.github.io/ideogram/homology_advanced.html

CircusJS can be accessible in the github repository below;

https://github.com/nicgirault/circosJS


![Alt text](/img/synteny.png?raw=true "Example Synteny Plot")
