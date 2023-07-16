# Notes on DOM elements for various news sites

##https://www.independent.co.uk/

<ol>
    <li>Article content is in p, each block has either outerText or Innertext which function similarly</li>
</ol>

##https://variety.com/2023/biz/news/disney-desantis-lawsuit-transferred-allen-winsor-trump-1235631064/

- It seems that innerText can be applied whether or not it's explitcitly specific since its a native thing to HTML
- The course of action may be to simply select all elements p and return innerText
- Further research may dictate that specific work arounds for the heavy hitters like CNN, Reuters, WSJ and BusinessInsider may require their own configuration; which is fine because those will be relatively consistent
