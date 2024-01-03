email : test@gmail.com
password: test

<form name="signUp" action="/signup" method="post">
            <p style="color: <%=theme==='Light' ? 'black': 'white' %>;
                background-color: <%=theme==='Light' ? 'white': 'black' %>;
        font-weight: bold;
        font-size: 20px;
        position: fixed;
        left: 560px;
        top: 140px;">
                Name</p>
            <div id="name"></div>
            <p style="color: <%=theme==='Light' ? 'black': 'white' %>;
                background-color: <%=theme==='Light' ? 'white': 'black' %>;
        font-weight: bold;
        font-size: 20px;
       
    
        position: fixed;
        left: 560px;
        top: 250px;">
                Email-ID</p>
            <div id="email"><input type="text" name="em" required>
            </div>
            <p style="color: <%=theme==='Light' ? 'black': 'white' %>;
                background-color: <%=theme==='Light' ? 'white': 'black' %>;
            font-weight: bold;
            font-size: 20px;
    
            position: fixed;
            left: 560px;
            top: 360px;">Create Password</p>
            <p>
            <div id="password"><input type="password" name="p" required></div>
            </p>

            <p style="color: <%=theme==='Light' ? 'black': 'white' %>;
                background-color: <%=theme==='Light' ? 'white': 'black' %>;
        font-weight: bold;
        font-size: 20px;

        position: fixed;
        left: 560px;
        top: 470px;">
                Confirm Password</p>
            <div id="confirmPassword"><input type="password" name="cp" required></div>
